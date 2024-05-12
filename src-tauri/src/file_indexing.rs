use std::{
    collections::HashMap,
    path::Path,
    sync::{Arc, Mutex},
    thread,
    time::{Duration, Instant},
};

use crate::{disks, enums::Command};
use notify_debouncer_full::{
    new_debouncer,
    notify::{event::ModifyKind, EventKind, RecursiveMode, Watcher},
};
use rayon::iter::{IntoParallelRefIterator, ParallelBridge, ParallelIterator};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager, State};
use walkdir::WalkDir;

#[derive(Serialize, Deserialize, Debug, Clone)]
pub struct RestrictedDirEntry {
    pub name: String,
    pub path: String,
    pub is_dir: bool,
}

pub struct Index {
    pub map: HashMap<String, Vec<RestrictedDirEntry>>,
}

impl Clone for Index {
    fn clone(&self) -> Self {
        Self {
            map: self.map.clone(),
        }
    }
}

impl Index {
    pub fn build() -> Self {
        let disks = disks::get_disks();

        let mut map: HashMap<String, Vec<RestrictedDirEntry>> = HashMap::new();

        for disk in disks {
            for entry in WalkDir::new(disk.mount_point)
                .into_iter()
                .filter(|e| e.is_ok())
                .map(|e| e.unwrap())
            {
                let entry = entry.path();

                let name = entry.file_name();

                if name.is_none() {
                    continue;
                }

                let name = name.unwrap().to_string_lossy().to_string();

                let name_clone = name.clone();
                let full_path = entry.to_string_lossy().to_string();

                let entry = RestrictedDirEntry {
                    name,
                    path: full_path.clone(),
                    is_dir: entry.is_dir(),
                };

                if map.contains_key(&name_clone) {
                    map.get_mut(&name_clone).unwrap().push(entry);
                } else {
                    map.insert(name_clone, vec![entry]);
                }
            }
        }

        Self { map }
    }
    pub fn read<P: AsRef<Path>>(path: P) -> Self {
        let start = Instant::now();

        let serialized = std::fs::read_to_string(path).unwrap();
        let map: HashMap<String, Vec<RestrictedDirEntry>> =
            serde_json::from_str(&serialized).unwrap();

        log::info!("Read index in {:?}", start.elapsed());

        Self { map }
    }

    pub fn write<P: AsRef<Path>>(&self, path: P) {
        let start = Instant::now();
        let serialized = serde_json::to_string(&self.map).unwrap();

        std::fs::write(path, serialized).unwrap();

        log::info!("Wrote index in {:?}", start.elapsed());
    }

    pub fn search(&self, query: &str) -> Vec<RestrictedDirEntry> {
        let query = query.to_lowercase();

        let start = std::time::Instant::now();

        let mut paths: Vec<RestrictedDirEntry> = self
            .map
            .par_iter()
            .flat_map(|(_, entries)| entries)
            .filter(|entry| entry.name.to_lowercase().contains(&query))
            .cloned()
            .collect();

        log::info!("Returned {:?} items in {:?}", paths.len(), start.elapsed());

        paths
    }
}

#[tauri::command]
pub fn watch_disk_changes(app: AppHandle) {
    let (tx, rx) = std::sync::mpsc::channel();

    let mut debouncer = new_debouncer(Duration::from_secs(1), None, tx).unwrap();

    thread::spawn(move || {
        let index = app.state::<Arc<Mutex<Index>>>();
        let disks = disks::get_disks();

        for disk in disks {
            let path = Path::new(&disk.mount_point);

            debouncer
                .watcher()
                .watch(path, RecursiveMode::Recursive)
                .unwrap();
        }

        for result in rx {
            if result.is_err() {
                continue;
            }

            let events = result.unwrap();

            for event in events {
                match event.kind {
                    EventKind::Create(_) => {
                        let path = event.paths[0].to_string_lossy().to_string();

                        let path = Path::new(&path);

                        let name = path.file_name().unwrap().to_string_lossy().to_string();
                        let name_clone = name.clone();
                        let full_path = path.to_string_lossy().to_string();

                        let entry = RestrictedDirEntry {
                            name,
                            path: full_path.clone(),
                            is_dir: path.is_dir(),
                        };

                        let mut index = index.lock().unwrap();

                        if index.map.contains_key(&full_path) {
                            index.map.get_mut(&name_clone).unwrap().push(entry);
                        } else {
                            index.map.insert(name_clone, vec![entry]);
                        }
                    }

                    EventKind::Modify(ModifyKind::Name(_)) => {
                        let old_path = event.paths.first().unwrap().to_string_lossy().to_string();
                        let new_path = event.paths.last().unwrap().to_string_lossy().to_string();

                        let old_path = Path::new(&old_path);
                        let new_path = Path::new(&new_path);

                        let old_name = old_path.file_name().unwrap().to_string_lossy().to_string();
                        let new_name = new_path.file_name().unwrap().to_string_lossy().to_string();

                        let mut index = index.lock().unwrap();

                        // if let Some(entries) = index.map.get_mut(&old_name) {
                        //     if let Some(entry) = entries
                        //         .iter_mut()
                        //         .find(|e| e.path == old_path.to_string_lossy())
                        //     {
                        //         entry.path = new_path.to_string_lossy().to_string();
                        //         entry.name = new_name;

                        //         entries.retain(|e| e.path != old_path.to_string_lossy());

                        //         if index.map.contains_key(&new_name) {
                        //             index.map.get_mut(&new_name).unwrap().push(entry.clone());
                        //         } else {
                        //             index.map.insert(new_name.clone(), vec![entry.clone()]);
                        //         }
                        //     }
                        // }
                    }

                    EventKind::Remove(_) => {
                        let path = event.paths[0].to_string_lossy().to_string();

                        let mut index = index.lock().unwrap();

                        if index.map.contains_key(&path) {
                            index.map.remove(&path);
                        }
                    }

                    _ => {}
                }
            }
        }
    });
}

#[tauri::command]
pub fn search_everywhere(
    app: AppHandle,
    index: State<Arc<Mutex<Index>>>,
    query: String,
    id: u64,
    label: String,
) -> Result<(), ()> {
    let index = index.lock().unwrap();
    let entries = index.search(&query);

    drop(index);

    let chunk_size = 20000;

    thread::spawn(move || {
        let chunks = entries.chunks(chunk_size);
        let chunks_len = chunks.len();

        for (i, chunk) in chunks.enumerate() {
            let mut chunk = chunk.to_vec();

            chunk.sort_by(|a, b| {
                if a.is_dir == b.is_dir {
                    a.name.to_lowercase().cmp(&b.name.to_lowercase())
                } else if a.is_dir {
                    std::cmp::Ordering::Less
                } else {
                    std::cmp::Ordering::Greater
                }
            });

            Command::SearchEverywhere(id, Some(chunk), None, i == chunks_len - 1)
                .emit(&app, label.clone());
        }
    });

    Ok(())
}
