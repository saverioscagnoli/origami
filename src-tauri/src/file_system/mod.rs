use serde::{Deserialize, Serialize};

pub mod commands;
pub mod dir;
pub mod file;
pub mod misc;
pub mod platform_impl;

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