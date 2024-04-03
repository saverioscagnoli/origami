use tauri::State;

use crate::{
  event_emitter::EventEmitter,
  fs_manager::FSManager,
  structs::Entry,
  utils,
};

use std::process::Command;

#[tauri::command]
pub async fn init_communication(app: tauri::AppHandle) {
  let event_emitter = EventEmitter::new(&app);

  event_emitter.start_emitting();
}

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
  path: String
) -> Result<(), String> {
  fs_manager.delete_entry(path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn star_entry(
  app: tauri::AppHandle,
  fs_manager: State<FSManager>,
  path: String
) -> Result<(), String> {
  let starred_dir = utils::get_starred_dir(&app).to_string_lossy().to_string();

  fs_manager.create_symlink(path, starred_dir).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn unstar_entry(
  app: tauri::AppHandle,
  fs_manager: State<FSManager>,
  name: String
) -> Result<(), String> {
  let starred_dir = utils::get_starred_dir(&app);
  let path = starred_dir.join(name).to_string_lossy().to_string();

  fs_manager.delete_entry(path).map_err(|e| e.to_string())
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

#[cfg(windows)]
use std::os::windows::process::CommandExt;

#[tauri::command]
pub fn open_vscode(path: String) {
  #[cfg(target_os = "windows")]
  Command::new("cmd")
    .args(["/C", format!("code {path}", path = path).as_str()])
    .creation_flags(0x08000000)
    .output()
    .expect("failed to execute process");

  #[cfg(not(target_os = "windows"))]
  Command::new("sh")
    .arg("-c")
    .arg(format!("code {path}", path = path).as_str())
    .output()
    .expect("failed to execute process");
}
