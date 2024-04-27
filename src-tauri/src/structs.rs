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
