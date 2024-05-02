// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod watcher;
mod events;
mod utils;
mod payloads;
mod structs;
mod file_system;
mod consts;
mod disks;
mod settings;

use consts::{ SETTINGS_FILE_NAME, STARRED_DIR_NAME };
use disks::emit_disks;

use settings::{ Settings, load_settings, update_settings };
use tauri::{ AppHandle, Manager };
use utils::get_os;
use watcher::start_watching;

use file_system::{
  list_dir,
  open_file,
  paste_entries,
  create_entry,
  rename_entry,
  delete_entries,
};

#[tokio::main(flavor = "multi_thread", worker_threads = 10)]
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
        start_watching,
        emit_disks,
        list_dir,
        open_file,
        paste_entries,
        create_entry,
        rename_entry,
        delete_entries,
        get_os,
        load_settings,
        update_settings
      ]
    )
    .setup(|app| {
      let handle = app.handle();
      let handle_clone = handle.clone();

      tokio::spawn(async move {
        init(&handle_clone).await;
      });

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

async fn init(app: &AppHandle) {
  let path = app.path();
  let starred_dir = path.app_config_dir().unwrap().join(STARRED_DIR_NAME);
  let settings_file = path.app_config_dir().unwrap().join(SETTINGS_FILE_NAME);

  if !starred_dir.exists() {
    std::fs::create_dir_all(&starred_dir).unwrap();
  }

  let mut settings: Settings;

  if !settings_file.exists() {
    settings = Settings::new();
  } else {
    settings = Settings::load(&settings_file).await;
  }

  settings.check_validity().await;
  settings.write(&settings_file).await;
}

// #[tauri::command]
// async fn start_watching<'a>(
//   event_pool: State<'a, Arc<Mutex<Vec<tauri::EventId>>>>,
//   app: AppHandle
// ) -> Result<(), tauri::Error> {
//   let (watcher, rx) = create_watcher().unwrap();

//   let watcher_mutex = Arc::new(Mutex::new(watcher));

//   let event_pool = Arc::clone(&event_pool);
//   let rx_mutex = Arc::new(tokio::sync::Mutex::new(rx));

//   let app_clone = app.clone();

//   listen::<WatchPayload>(event_pool, &app, EventFromFrontend::DirChanged, move |p| {
//     let mut watcher = watcher_mutex.lock().unwrap();

//     let rx_mutex = Arc::clone(&rx_mutex);

//     if &p.old_path != "" {
//       match unwatch(&mut watcher, &p.old_path) {
//         Ok(_) => {}
//         Err(e) => log::error!("failed to unwatch: {:?}", e),
//       }
//     }

//     match watch(&app_clone, &mut watcher, rx_mutex, &p.new_path) {
//       Ok(_) => {}
//       Err(e) => log::error!("failed to watch: {:?}", e),
//     }
//   });

//   Ok(())
// }
