use std::process::Command;

#[cfg(target_os = "windows")]
pub fn check_vscode_install() -> bool {
  // Check if VSCode is installed with the `code` command

  use std::os::windows::process::CommandExt;

  use crate::consts::FLAG_CREATE_NO_WINDOW;

  return Command::new("cmd")
    .args(&["/C", "code", "--version"])
    .creation_flags(FLAG_CREATE_NO_WINDOW)
    .output()
    .is_ok();
}

#[cfg(not(target_os = "windows"))]
pub fn check_vscode_install() -> bool {
  // Check if VSCode is installed with the `code` command

  return Command::new("code").args(&["--version"]).output().is_ok();
}

#[cfg(target_os = "windows")]
pub fn check_windows_terminal_install() -> bool {
  use std::env;
  use std::path::Path;

  if let Ok(path) = env::var("PATH") {
    for p in path.split(';') {
      let p_str = Path::new(p);
      if p_str.join("wt.exe").exists() {
        return true;
      }
    }
  }

  false
}

#[tauri::command]
#[cfg(target_os = "windows")]
pub async fn open_in_vscode(dir: String) -> (String, String) {
  use std::os::windows::process::CommandExt;

  use crate::consts::FLAG_CREATE_NO_WINDOW;

  let output = Command::new("cmd")
    .args(&["/C", "code", &dir])
    .creation_flags(FLAG_CREATE_NO_WINDOW)
    .output();

  match output {
    Ok(_) => (dir, "".to_string()),
    Err(e) => ("".to_string(), e.to_string()),
  }
}

#[tauri::command]
#[cfg(target_os = "windows")]
pub async fn open_in_windows_terminal(dir: String) -> (String, String) {
  use std::os::windows::process::CommandExt;

  use crate::consts::FLAG_CREATE_NO_WINDOW;

  let output = Command::new("cmd")
    .args(&["/C", "wt", "-d", &dir])
    .creation_flags(FLAG_CREATE_NO_WINDOW)
    .output();

  match output {
    Ok(_) => (dir, "".to_string()),
    Err(e) => ("".to_string(), e.to_string()),
  }
}
