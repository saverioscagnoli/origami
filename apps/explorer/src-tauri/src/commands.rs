use tauri::State;
use crate::{ fs_manager::FSManager, structs::Entry, utils };

#[tauri::command]
pub async fn read_dir<'a>(
  app: tauri::AppHandle,
  fs_manager: State<'a, FSManager>,
  path: String
) -> Result<Vec<Entry>, ()> {
  let path_resolver = app.path_resolver();
  let starred_dir = path_resolver.app_config_dir().unwrap().join("starred");

  let mut entries = fs_manager.read_dir(path, starred_dir).await;

  utils::sort_dir(&mut entries);

  Ok(entries)
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
  path: String,
  is_folder: bool
) -> Result<(), String> {
  let starred_dir = utils::get_starred_dir(&app).to_string_lossy().to_string();

  fs_manager.create_symlink(path, starred_dir, is_folder).map_err(|e| e.to_string())
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

#[tauri::command]
pub async fn get_file_size<'a>(
  fs_manager: State<'a, FSManager>,
  path: String
) -> Result<u64, ()> {
  let size = fs_manager.get_file_size(path).await;
  Ok(size)
}
