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
