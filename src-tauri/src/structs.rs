use std::path::Path;

use serde::{ Deserialize, Serialize };

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DirEntry {
  pub path: String,
  pub name: String,
  pub is_dir: bool,
  pub is_hidden: bool,
  pub is_symlink: bool,
  pub is_starred: bool,
  pub last_modified: String,
  pub size: u64,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
  pub name: String,
  pub mount_point: String,
  pub file_system: String,
  pub total_space: u64,
  pub free_space: u64,
  pub is_removable: bool,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
  pub theme: String,
  pub view: String,
  pub show_hidden: bool,
  pub show_checkboxes: bool,
}

impl Settings {
  pub fn new() -> Self {
    Self {
      theme: "system".to_string(),
      view: "list".to_string(),
      show_hidden: false,
      show_checkboxes: false,
    }
  }

  pub async fn write_default(&self, path: impl AsRef<Path>) {
    let settings = serde_json::to_string_pretty(&self).unwrap();
    let _ = tokio::fs::write(path, settings).await;
  }
}
