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
pub async fn delete_entry<'a>(
  api: State<'a, Api>,
  path: String
) -> Result<(), String> {
  match api.delete_entry(&path) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}
