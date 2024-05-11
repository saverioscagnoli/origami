// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_windows;
mod consts;
mod disks;
mod enums;
mod file_system;

use disks::poll_disks;
use file_system::commands::{
    create_entry, delete_entries, list_dir, open_files, paste_entries, rename_entry,
};
use app_windows::{spawn_main_window, close_all_windows};

#[tokio::main]
async fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    // Set tokio runtime
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .invoke_handler(tauri::generate_handler![
            create_entry,
            delete_entries,
            list_dir,
            open_files,
            paste_entries,
            rename_entry,
            poll_disks,
            spawn_main_window,
            close_all_windows
        ])
        .on_page_load(|_window, _| {
            #[cfg(debug_assertions)]
            {
                // Open devtools in debug mode
                _window.open_devtools();
            }
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
