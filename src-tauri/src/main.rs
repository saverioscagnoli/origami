// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod watcher;
mod events;
mod utils;
mod payloads;
mod structs;
mod file_system;
mod consts;

use events::EventFromFrontend;
use payloads::WatchPayload;
use std::sync::{ Arc, Mutex };
use tauri::{ AppHandle, Manager, State };
use utils::listen;
use watcher::{ create_watcher, unwatch, watch };

use file_system::{ list_dir, open_file };

#[tokio::main]
async fn main() {
  env_logger::Builder
    ::from_env(env_logger::Env::default().default_filter_or("info"))
    .init();

  tauri::Builder
    ::default()
    .plugin(tauri_plugin_shell::init())
    .invoke_handler(
      tauri::generate_handler![start_watching, list_dir, open_file, stop_all]
    )
    .setup(|app| {
      let event_pool: Arc<Mutex<Vec<tauri::EventId>>> = Arc::new(
        Mutex::new(Vec::new())
      );

      app.manage(event_pool);

      Ok(())
    })
    .on_page_load(|_window, _| {
      #[cfg(debug_assertions)]
      {
        _window.open_devtools();
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

#[tauri::command]
async fn start_watching<'a>(
  event_pool: State<'a, Arc<Mutex<Vec<tauri::EventId>>>>,
  app: AppHandle
) -> Result<(), tauri::Error> {
  let (watcher, rx) = create_watcher().unwrap();

  let watcher_mutex = Arc::new(Mutex::new(watcher));
  let rx_mutex = Arc::new(Mutex::new(rx));

  let event_pool = Arc::clone(&event_pool);

  listen::<WatchPayload>(event_pool, &app, EventFromFrontend::DirChanged, move |p| {
    let mut watcher = watcher_mutex.lock().unwrap();
    let mut rx = rx_mutex.lock().unwrap();

    match unwatch(&mut watcher, &p.old_path) {
      Ok(_) => log::info!("unwatched: {:?}", &p.old_path),
      Err(e) => log::error!("failed to unwatch: {:?}", e),
    }

    let _ = watch(&mut watcher, &mut rx, &p.new_path);
  });

  Ok(())
}

#[tauri::command]
fn stop_all(event_pool: State<Arc<Mutex<Vec<tauri::EventId>>>>, app: AppHandle) {
  if let Ok(mut event_pool) = event_pool.lock() {
    for id in event_pool.iter() {
      app.unlisten(*id);

      log::warn!("unlistened: {:?}", id);
    }

    event_pool.clear();
  }
}
