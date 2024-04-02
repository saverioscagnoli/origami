use std::{ path::PathBuf, process::Command };

#[cfg(target_os = "windows")]
use std::os::windows::process::CommandExt;

pub fn check_vscode_install() -> Result<bool, String> {
  let output = Command::new("cmd")
    .args(["/C", "code -v"])
    .creation_flags(0x08000000)
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
