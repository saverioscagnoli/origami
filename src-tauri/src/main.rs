// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_windows;
mod consts;
mod disks;
mod enums;
mod file_system;
mod modules;
mod settings;
mod utils;

use app_windows::{close_all_windows, spawn_main_window};
use consts::STARRED_DIR_NAME;
use disks::poll_disks;
use file_system::commands::{
    create_entry, delete_entries, get_image_base64, list_dir, open_files, paste_entries,
    rename_entry, star_entries, unstar_entries,
};
use modules::load_css_modules;
use settings::{load_settings, update_settings};
use tauri::{AppHandle, Manager};
use utils::build_app_paths;

#[tokio::main]
async fn main() {
    env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();

    // Set tokio runtime
    tauri::async_runtime::set(tokio::runtime::Handle::current());

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            create_entry,
            delete_entries,
            get_image_base64,
            list_dir,
            open_files,
            paste_entries,
            rename_entry,
            star_entries,
            unstar_entries,
            poll_disks,
            spawn_main_window,
            close_all_windows,
            load_settings,
            update_settings,
            load_css_modules,
        ])
        .setup(|app| {
            let handle = app.handle();

            let app_paths = build_app_paths(handle);

            app.manage(app_paths);

            init(handle);

            Ok(())
        })
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

fn init(app: &AppHandle) {
    let path = app.path();
    let starred_dir = path.app_config_dir().unwrap().join(STARRED_DIR_NAME);

    if !starred_dir.exists() {
        std::fs::create_dir_all(&starred_dir).unwrap();
    }
}
