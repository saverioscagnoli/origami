use std::{ os::windows::process::CommandExt, process::Command };

use serde::Serialize;
use tauri::{ AppHandle, Event, Manager };

use crate::enums::{ EventFromFrontend, EventToFrontend };

pub fn once<F>(app: &AppHandle, evt: EventFromFrontend, handler: F)
  where F: FnOnce(Event) + Send + 'static
{
  app.once(EventFromFrontend::as_str(&evt), handler);
}

pub fn emit<P>(
  app: &AppHandle,
  evt: EventToFrontend,
  payload: P
) -> Result<(), String>
  where P: Serialize + Clone
{
  match app.emit(EventToFrontend::as_str(&evt), payload) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

pub fn listen<F>(app: &AppHandle, evt: EventFromFrontend, handler: F)
  where F: Fn(Event) + Send + 'static
{
  app.listen(EventFromFrontend::as_str(&evt), handler);
}

pub fn check_vscode_install() -> bool {
  #[cfg(target_os = "windows")]
  {
    Command::new("cmd")
      .arg("/C")
      .arg("code --version")
      .creation_flags(0x00000008)
      .output()
      .is_ok()
  }

  #[cfg(not(target_os = "windows"))]
  {
    Command::new("sh").arg("-c").arg("code --version").output().is_ok()
  }
}

#[tauri::command]
pub fn check_windows_terminal_install() -> bool {
  #[cfg(target_os = "windows")]
  {
    let output = Command::new("powershell")
      .arg("/C")
      .creation_flags(0x00000008)
      .arg("wt -v")
      .output();

    output.is_ok()
  }

  #[cfg(not(target_os = "windows"))]
  {
    false
  }
}
