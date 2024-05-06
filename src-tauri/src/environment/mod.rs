use serde::{ Deserialize, Serialize };

use self::platform_impl::{ check_vscode_install, check_windows_terminal_install };

pub mod platform_impl;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Environment {
  pub is_vscode_installed: bool,

  #[cfg(target_os = "windows")]
  pub is_windows_terminal_installed: bool,
}

#[tauri::command]
pub fn load_environment() -> Environment {
  let is_vscode_installed = check_vscode_install();

  #[cfg(target_os = "windows")]
  let is_windows_terminal_installed = check_windows_terminal_install();

  Environment {
    is_vscode_installed,

    #[cfg(target_os = "windows")] is_windows_terminal_installed,
  }
}
