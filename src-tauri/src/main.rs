// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod app_windows;
mod consts;
mod disks;
mod enums;
mod file_indexing;
mod file_system;
mod settings;

use std::{
    sync::{Arc, Mutex},
    thread,
};

use app_windows::{close_all_windows, spawn_main_window};
use consts::{INDEX_FILE_NAME, STARRED_DIR_NAME};
use disks::poll_disks;
use file_indexing::{search_everywhere, watch_disk_changes, Index};
use file_system::commands::{
    create_entry, delete_entries, get_image_base64, list_dir, open_files, paste_entries,
    rename_entry, star_entries, unstar_entries,
};
use settings::{load_settings, update_settings};
use tauri::{AppHandle, Manager};

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
            build_index,
            search_everywhere,
            watch_disk_changes
        ])
        .setup(|app| {
            let handle = app.handle();
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

#[tauri::command]
async fn build_index(app: AppHandle) {
    let path = app.path();
    let index_path = path.app_config_dir().unwrap().join(INDEX_FILE_NAME);

    thread::spawn(move || {
        let index = if !index_path.exists() {
            let start = std::time::Instant::now();
            let index = Index::build();

            index.write(&index_path);

            log::info!("Built index in {:?}", start.elapsed());
            index
        } else {
            Index::read(&index_path)
        };

        app.manage(Arc::new(Mutex::new(index)));
    })
    .join()
    .unwrap();
}
