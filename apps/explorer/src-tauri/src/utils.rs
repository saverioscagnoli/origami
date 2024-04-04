use std::{ cmp::Ordering, path::PathBuf, process::Command };

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

use crate::structs::Entry;

pub fn sort_dir(entries: &mut Vec<Entry>) {
  entries.sort_by(|a, b| {
    match (a.is_folder, b.is_folder) {
      (true, false) => Ordering::Less,
      (false, true) => Ordering::Greater,
      _ => a.name.to_lowercase().cmp(&b.name.to_lowercase()),
    }
  });
}

#[cfg(target_os = "windows")]
pub fn check_vscode_install() -> Result<bool, String> {
  let output = Command::new("cmd")
    .args(["/C", "code -v"])
    .creation_flags(0x08000000)
    .output()
    .expect("failed to execute process");

  Ok(output.status.success())
}

#[cfg(not(target_os = "windows"))]
pub fn check_vscode_install() -> Result<bool, String> {
  let output = Command::new("sh")
    .arg("-c")
    .arg("code -v")
    .output()
    .expect("failed to execute process");

  Ok(output.status.success())
}

pub fn get_starred_dir(app: &tauri::AppHandle) -> PathBuf {
  let path_resolver = app.path_resolver();

  let config_dir = path_resolver.app_config_dir().unwrap();
  let starred_dir = config_dir.join("starred");

  starred_dir
}
