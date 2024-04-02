use tauri::State;
use crate::{ fs_manager::FSManager, structs::Entry, utils };

#[tauri::command]
pub fn read_dir(app: tauri::AppHandle, fs_manager: State<FSManager>, path: String) -> Vec<Entry> {
  let path_resolver = app.path_resolver();
  let starred_dir = path_resolver.app_config_dir().unwrap().join("starred");

  fs_manager.read_dir(path, starred_dir)
}

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

#[tauri::command]
pub fn open_file(path: String) {
  opener::open(path).unwrap_or(());
}

#[tauri::command]
pub fn paste(
  fs_manager: State<FSManager>,
  source: String,
  target: String,
  cutting: bool
) -> Result<(), String> {
  fs_manager.paste(source, target, cutting).map_err(|e| e.to_string())
}
