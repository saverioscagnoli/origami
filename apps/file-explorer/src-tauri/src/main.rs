// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::fs;

use serde::{ Deserialize, Serialize };
use sysinfo::Disks;
use tauri::Manager;

#[tauri::command]
fn minimize(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    window.minimize().unwrap();
  }
}

#[tauri::command]
fn toggle_maximize(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    if window.is_maximized().unwrap() {
      window.unmaximize().unwrap();
    } else {
      window.maximize().unwrap();
    }
  }
}

#[tauri::command]
fn quit(app: tauri::AppHandle) {
  app.exit(0);
}

#[derive(Serialize, Deserialize)]
struct Disk {
  available_space: u64,
  total_space: u64,
}

#[derive(Serialize, Deserialize)]
struct DirEntry {
  name: String,
  full_path: String,
  is_folder: bool,
}

#[tauri::command]
fn read_dir(path: Option<String>) -> Vec<DirEntry> {
  let mut entries: Vec<DirEntry> = Vec::new();

  let paths;

  if path.is_none() {
    let home_dir = dirs::home_dir().unwrap();
    paths = fs::read_dir(home_dir).unwrap();
  } else {
    paths = fs::read_dir(path.unwrap()).unwrap();
  }

  for path in paths {
    if let Ok(path) = path {
      entries.push(DirEntry {
        name: path.file_name().to_str().unwrap().to_string(),
        full_path: path.path().to_str().unwrap().to_string(),
        is_folder: path.file_type().unwrap().is_dir(),
      });
    }
  }

  entries
}

#[tauri::command]
fn list_disks() -> Vec<Disk> {
  let mut disks: Vec<Disk> = Vec::new();
  for disk in Disks::new_with_refreshed_list().list() {
    if disk.file_system() != "vfat" {
      disks.push(Disk {
        available_space: disk.available_space() / (1024 * 1024 * 1024),
        total_space: disk.total_space() / (1024 * 1024 * 1024),
      });
    }
  }

  disks
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(tauri::generate_handler![minimize, toggle_maximize, quit, list_disks, read_dir])
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      window.open_devtools();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
