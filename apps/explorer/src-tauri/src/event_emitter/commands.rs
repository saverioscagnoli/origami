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
    Command::new("cmd")
      .args(&["/C", "code", &path])
      .spawn()
      .map_err(|e| e.to_string())?;
  }

  #[cfg(not(target_os = "windows"))]
  {
    Command::new("sh")
      .arg("-c")
      .arg(format!("code {}", path))
      .spawn()
      .map_err(|_| "failed to open in vscode".to_string())
      .map(|_| ())
  }
}
