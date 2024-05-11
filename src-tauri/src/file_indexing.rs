use std::{collections::HashMap, thread};

use rayon::iter::{IntoParallelRefIterator, ParallelBridge, ParallelIterator};
use tauri::{AppHandle, Manager, State};
use walkdir::WalkDir;

use crate::{
    consts::STARRED_DIR_NAME,
    enums::Command,
    file_system::{self, DirEntry},
};

/**
 * The index is a HashMap that maps the file name to its path.
 */
pub struct Index {
    pub map: HashMap<String, DirEntry>,
}

impl Clone for Index {
    fn clone(&self) -> Self {
        Self {
            map: self.map.clone(),
        }
    }
}

impl Index {
    pub fn build(app: &AppHandle) -> Self {
        let start = std::time::Instant::now();

        let path = app.path();
        let starred_dir = path.app_config_dir().unwrap().join(STARRED_DIR_NAME);

        let map: HashMap<String, DirEntry> = WalkDir::new("C:\\")
            .into_iter()
            .par_bridge()
            .filter_map(Result::ok)
            .filter_map(|entry| {
                let path = entry.path();
                let name = path.file_name()?.to_string_lossy().to_string();
                let entry = file_system::into_entry(&path, &starred_dir);

                if entry.is_none() {
                    return None;
                }

                Some((name, entry.unwrap()))
            })
            .collect();

        log::info!("Index built in {:?}", start.elapsed());

        Self { map }
    }

    pub fn search(&self, query: &str) -> Vec<DirEntry> {
        let start = std::time::Instant::now();
        let paths = self
            .map
            .par_iter()
            .filter(|(name, _)| name.contains(query))
            .map(|(_, path)| path.clone())
            .collect::<Vec<DirEntry>>();

        // let entries: Vec<DirEntry> = paths
        //     .par_iter()
        //     .map(|path| file_system::into_entry(path, "aaaa").unwrap())
        //     .collect::<Vec<_>>();

        log::info!("Returned {:?} items in {:?}", paths.len(), start.elapsed());

        paths
    }
}

#[tauri::command]
pub fn search_everywhere<'a>(
    app: AppHandle,
    index: State<Index>,
    query: String,
    id: u64,
    label: String,
) -> Result<(), ()> {
    let entries = index.search(&query);
    let chunk_size = 20000; // Define your chunk size here

    thread::spawn(move || {
        let chunks = entries.chunks(chunk_size);
        let chunks_len = chunks.len();

        for (i, chunk) in chunks.enumerate() {
            let chunk = chunk.to_vec();
            Command::SearchEverywhere(id, Some(chunk), None, i == chunks_len - 1)
                .emit(&app, label.clone());
        }
    });

    Ok(())
}
