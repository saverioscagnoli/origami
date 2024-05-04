use self::api::DirEntry;

pub mod api;
pub mod platform_impl;

#[tauri::command]
pub async fn list_dir(path: String) -> Result<Vec<DirEntry>, String> {
  api::list_dir(path).await
}
