use std::path::{ self, Path };

use tauri::{ AppHandle, Manager };

use crate::consts::STARRED_DIR_NAME;

use self::api::DirEntry;

pub mod api;
pub mod platform_impl;

#[tauri::command]
pub async fn list_dir(app: AppHandle, path: String) -> (Vec<DirEntry>, String) {
  let path_resolver = app.path();
  let starred_dir = path_resolver.app_config_dir().unwrap().join(STARRED_DIR_NAME);

  match api::list_dir(path, starred_dir).await {
    Ok(entries) => (entries, "".to_string()),
    Err(e) => (vec![], e.to_string()),
  }
}

#[tauri::command]
pub async fn open_files(paths: Vec<String>) -> Result<(), String> {
  for path in paths {
    if let Err(e) = api::open_file(path) {
      return Err(e.to_string());
    }
  }

  Ok(())
}

#[tauri::command]
pub async fn rename_entry(path: String, new_name: String) -> (String, String) {
  match api::rename_entry(&path, new_name) {
    Ok(_) => (path, "".to_string()),
    Err(e) => (path, e.to_string()),
  }
}

#[tauri::command]
pub async fn delete_entries(paths: Vec<String>) -> (Vec<String>, Vec<String>) {
  let mut errors = vec![];
  let paths_clone = paths.clone();

  for path in paths {
    match api::delete_entry(&path) {
      Ok(_) => {}
      Err(e) => {
        errors.push(e.to_string());
      }
    }
  }

  (paths_clone, errors)
}

#[tauri::command]
pub async fn create_entry(path: String, is_dir: bool) -> (String, String) {
  match api::create_entry(&path, is_dir) {
    Ok(_) => (path, "".to_string()),
    Err(e) => (path, e.to_string()),
  }
}

#[tauri::command]
pub async fn get_image_base64(path: String) -> (String, String) {
  match api::get_image_base64(path) {
    Ok(base64) => (base64, "".to_string()),
    Err(e) => ("".to_string(), e.to_string()),
  }
}

#[tauri::command]
pub async fn star_entries(
  app: AppHandle,
  paths: Vec<String>
) -> (Vec<String>, Vec<String>) {
  let path_resolver = app.path();
  let starred_dir = path_resolver.app_config_dir().unwrap().join(STARRED_DIR_NAME);

  let mut errors = vec![];

  for path in paths.clone() {
    let path = Path::new(&path);
    let file_name = path.file_name().unwrap();

    let starred_path = starred_dir.join(file_name);

    match platform_impl::create_symlink(path, &starred_path) {
      Ok(_) => {}
      Err(e) => {
        log::info!("Starred path: {:?}", &starred_path);

        errors.push(e.to_string());
      }
    }
  }

  (paths, errors)
}

#[tauri::command]
pub async fn unstar_entries(
  app: AppHandle,
  paths: Vec<String>
) -> (Vec<String>, Vec<String>) {
  let path_resolver = app.path();
  let starred_dir = path_resolver.app_config_dir().unwrap().join(STARRED_DIR_NAME);

  let mut errors = vec![];

  for path in paths.clone() {
    let path = Path::new(&path);
    let file_name = path.file_name().unwrap();

    let starred_path = starred_dir.join(file_name);

    match api::delete_entry(&starred_path) {
      Ok(_) => {}
      Err(e) => {
        errors.push(e.to_string());
      }
    }
  }

  (paths, errors)
}
