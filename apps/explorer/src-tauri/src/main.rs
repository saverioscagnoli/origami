// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;
use chrono::prelude::{ DateTime, Utc };

use globmatch::is_hidden_path;
use serde::{ Deserialize, Serialize };
use tauri::Manager;
use window_shadows::set_shadow;

#[derive(Serialize, Deserialize)]
struct DirEntry {
  name: String,
  path: String,
  is_folder: bool,
  is_hidden: bool,
  last_modified: String,
  size: String,
}

#[derive(Serialize, Deserialize)]
struct Disk {
  name: String,
  total: f64,
  free: f64,
  mount_point: String,
}

#[tauri::command]
fn read_dir(path: String) -> Vec<DirEntry> {
  let mut entries = Vec::new();

  for entry in fs::read_dir(path).unwrap() {
    let entry = entry.unwrap();
    let path = entry.path();
    let name = entry.file_name();
    let is_folder = path.is_dir();
    let is_hidden = is_hidden_path(&path);
    let modified = fs::metadata(&path).unwrap().modified().unwrap();
    let datetime: DateTime<Utc> = DateTime::from(modified);

    let size: f64;

    if is_folder {
      size = 0.0;
    } else {
      size = (fs::metadata(&path).unwrap().len() as f64) / 1024.0 / 1024.0;
    }

    let size = format!("{:.2} MB", size);

    entries.push(DirEntry {
      name: name.to_string_lossy().to_string(),
      path: path.to_string_lossy().to_string(),
      is_folder,
      is_hidden,
      last_modified: datetime.format("%d/%m/%Y %H:%M").to_string(),
      size,
    });
  }

  entries
}

#[tauri::command]
fn open_file(path: String) {
  opener::open(path).unwrap_or(());
}

#[tauri::command]
fn list_disks() -> Vec<Disk> {
  let mut disks = Vec::new();

  for disk in sysinfo::Disks::new_with_refreshed_list().iter() {
    let total = (disk.total_space() as f64) / 1024.0 / 1024.0 / 1024.0;
    let free = (disk.available_space() as f64) / 1024.0 / 1024.0 / 1024.0;

    disks.push(Disk {
      name: disk.name().to_str().unwrap().to_string(),
      total: f64::trunc(total * 100.0) / 100.0,
      free: f64::trunc(free * 100.0) / 100.0,
      mount_point: disk.mount_point().to_str().unwrap().to_string(),
    });
  }

  disks
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(tauri::generate_handler![read_dir, open_file, list_disks])
    .setup(|app| {
      let window: tauri::Window = app.get_window("main").unwrap();

      #[cfg(any(windows, target_os = "macos"))]
      set_shadow(&window, true).unwrap();

      #[cfg(debug_assertions)]
      {
        window.open_devtools();
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
