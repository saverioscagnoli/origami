// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_system;
mod disks;
mod consts;

use file_system::api::list_dir;
use disks::poll_disks;

fn main() {
  env_logger::Builder
    ::from_env(env_logger::Env::default().default_filter_or("info"))
    .init();

  tauri::Builder
    ::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(tauri::generate_handler![list_dir, poll_disks])
    .on_page_load(|_window, _| {
      #[cfg(debug_assertions)]
      {
        _window.open_devtools();
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
