use std::process::Command;

use tauri::AppHandle;
use super::EventEmitter;

#[tauri::command]
pub fn init_emitter(app: AppHandle) -> Result<(), String> {
  let event_emitter = EventEmitter::new(&app);
  event_emitter.start_emitting()
}

#[tauri::command]
pub async fn open_in_vscode(path: String) -> Result<(), String> {
  #[cfg(target_os = "windows")]
  {
    use std::os::windows::process::CommandExt;

    Command::new("cmd")
      .args(&["/C", "code", &path])
      .creation_flags(0x00000008)
      .spawn()
      .map_err(|e| e.to_string())
      .map(|_| ())
  }

  #[cfg(not(target_os = "windows"))]
  {
    Command::new("sh")
      .arg("-c")
      .arg(format!("code {}", path))
      .spawn()
      .map_err(|e| e.to_string())
      .map(|_| ())
  }
}

#[tauri::command]
pub async fn open_in_windows_terminal(path: String) {
  #[cfg(target_os = "windows")]
  {
    use std::os::windows::process::CommandExt;

    Command::new("cmd")
      .args(&["/C", "wt ", "-w", "1", "-d", &path])
      .creation_flags(0x00000008)
      .spawn()
      .expect("failed to open in Windows Terminal");
  }
}
