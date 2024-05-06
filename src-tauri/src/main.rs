// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod file_system;
mod disks;
mod consts;
mod settings;
mod utils;

use file_system::{
  list_dir,
  open_files,
  rename_entry,
  delete_entries,
  create_entry,
  star_entries,
  unstar_entries,
  paste_entries,
  get_image_base64,
};
use disks::poll_disks;
use settings::{ load_settings, update_settings };
use utils::close_window;

#[tokio::main]
async fn main() {
  env_logger::Builder
    ::from_env(env_logger::Env::default().default_filter_or("info"))
    .init();

  tauri::async_runtime::set(tokio::runtime::Handle::current());

  tauri::Builder
    ::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(
      tauri::generate_handler![
        load_settings,
        update_settings,
        list_dir,
        poll_disks,
        open_files,
        rename_entry,
        delete_entries,
        create_entry,
        star_entries,
        unstar_entries,
        paste_entries,
        get_image_base64,
        close_window
      ]
    )
    .on_page_load(|_window, _| {
      #[cfg(debug_assertions)]
      {
        _window.open_devtools();
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
