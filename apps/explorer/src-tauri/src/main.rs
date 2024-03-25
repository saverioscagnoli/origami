// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{ fs, path::PathBuf };

use serde::{ Deserialize, Serialize };
use tauri::Manager;
use window_shadows::set_shadow;

#[derive(Serialize, Deserialize)]
struct DirEntry {
  name: String,
  path: String,
  is_folder: bool,
}

#[tauri::command]
fn read_dir(path: String) -> Vec<DirEntry> {
  let mut entries = Vec::new();

  for entry in fs::read_dir(path).unwrap() {
    let entry = entry.unwrap();
    let path = entry.path();
    let name = entry.file_name();
    let is_folder = path.is_dir();

    entries.push(DirEntry {
      name: name.to_string_lossy().to_string(),
      path: path.to_string_lossy().to_string(),
      is_folder,
    });
  }

  entries
}

#[tauri::command]
fn rename_file(old_path: String, new_path: String) {
  fs::rename(old_path, new_path).unwrap();
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(tauri::generate_handler![read_dir, rename_file])
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
