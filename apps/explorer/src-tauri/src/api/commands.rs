use std::path::Path;

use tauri::{ AppHandle, State };

use crate::{ api::Api, enums::EventToFrontend, utils::emit };

#[tauri::command]
pub fn request_dir_listing(
  app: AppHandle,
  api: State<Api>,
  path: String
) -> Result<(), String> {
  match api.read_dir(&path) {
    Ok(entries) => { emit(&app, EventToFrontend::DirListed(true), &(entries, path)) }
    Err(e) => {
      emit(&app, EventToFrontend::DirListed(false), &(path, e.to_string()))
    }
  }
}

#[tauri::command]
pub async fn open_file(path: String) -> Result<(), String> {
  match open::that(path) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
pub async fn star_entry<'a>(
  api: State<'a, Api>,
  path: String
) -> Result<(), String> {
  let path = Path::new(&path);

  let starred_path = api.starred_dir.join(path.file_name().unwrap());

  match api.create_symlink(&path, &starred_path) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
pub async fn unstar_entry<'a>(
  api: State<'a, Api>,
  name: String
) -> Result<(), String> {
  let path = api.starred_dir.join(name);

  match api.delete_entry(&path) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
pub async fn cut_entry<'a>(
  api: State<'a, Api>,
  old_path: String,
  new_dir: String,
  new_name: String
) -> Result<(), String> {
  let new_path = Path::new(&new_dir).join(&new_name);

  match api.cut_or_copy(&old_path, &new_path, true) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
pub async fn copy_entry<'a>(
  api: State<'a, Api>,
  old_path: String,
  new_dir: String,
  new_name: String
) -> Result<(), String> {
  println!("old_path: {}", old_path);
  let new_path = Path::new(&new_dir).join(&new_name);

  match api.cut_or_copy(&old_path, &new_path, false) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
pub async fn rename_entry<'a>(
  api: State<'a, Api>,
  old_path: String,
  new_name: String
) -> Result<(), String> {
  let new_path = Path::new(&old_path).with_file_name(&new_name);

  match api.rename_entry(&old_path, &new_path) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

#[tauri::command]
pub async fn delete_entry<'a>(
  api: State<'a, Api>,
  path: String
) -> Result<(), String> {
  match api.delete_entry(&path) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}
