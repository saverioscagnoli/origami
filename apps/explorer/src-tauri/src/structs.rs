use serde::{ Deserialize, Serialize };

#[derive(Debug, Serialize, Deserialize)]
pub struct Entry {
  pub name: String,
  pub path: String,
  pub is_folder: bool,
  pub is_hidden: bool,
  pub is_symlink: bool,
  pub is_starred: bool,
  pub last_modified: String,
  pub size: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Disk {
  pub name: String,
  pub total: f64,
  pub free: f64,
  pub mount_point: String,
  pub is_removable: bool,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Constants {
  pub is_vscode_installed: bool,
}
