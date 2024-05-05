use self::api::DirEntry;

pub mod api;
pub mod platform_impl;

#[tauri::command]
pub async fn list_dir(path: String) -> (Vec<DirEntry>, String) {
  match api::list_dir(path).await {
    Ok(entries) => (entries, "".to_string()),
    Err(e) => (vec![], e.to_string()),
  }
}

#[tauri::command]
pub async fn open_files(paths: Vec<String>) -> Result<(), String> {
  for path in paths {
    if let Err(e) = open::that(path) {
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