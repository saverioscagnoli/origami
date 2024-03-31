use tauri::State;

use crate::{ fs_manager::FSManager, utils };

#[tauri::command]
pub fn create_entry(
  fs_manager: State<FSManager>,
  dir: String,
  name: String,
  is_folder: bool
) -> Result<(), String> {
  fs_manager.create_entry(dir, name, is_folder).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_entry(
  fs_manager: State<FSManager>,
  dir: String,
  name: String,
  is_folder: bool
) -> Result<(), String> {
  fs_manager.delete_entry(dir, name, is_folder).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn star_entry(
  app: tauri::AppHandle,
  fs_manager: State<FSManager>,
  dir: String,
  name: String,
  is_folder: bool
) -> Result<(), String> {
  let starred_dir = utils::get_starred_dir(&app);

  fs_manager.create_symlink(dir, starred_dir, name, is_folder).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unstar_entry(
  app: tauri::AppHandle,
  fs_manager: State<FSManager>,
  name: String,
  is_folder: bool
) -> Result<(), String> {
  let starred_dir = utils::get_starred_dir(&app);

  fs_manager.delete_entry(starred_dir, name, is_folder).map_err(|e| e.to_string())
}
