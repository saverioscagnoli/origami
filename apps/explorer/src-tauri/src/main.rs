#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod fs_manager;
mod event_emitter;
mod structs;
mod commands;
mod utils;

use std::{ env, fs };
use event_emitter::EventEmitter;
use fs_manager::FSManager;
use tauri::Manager;

#[cfg(any(windows, target_os = "macos"))]
use window_shadows::set_shadow;

fn init(app: &tauri::AppHandle) {
  let path_resolver = app.path_resolver();
  let config_dir = path_resolver.app_config_dir().unwrap();

  let starred_dir = config_dir.join("starred");

  if !starred_dir.exists() {
    fs::create_dir_all(&starred_dir).unwrap();
  }

  //let config_file = config_dir.join("config.json");
}

fn main() {
  let fs_manager = FSManager::new();

  tauri::Builder
    ::default()
    .invoke_handler(
      tauri::generate_handler![
        commands::init_communication,
        commands::read_dir,
        commands::open_file,
        commands::create_entry,
        commands::delete_entry,
        commands::star_entry,
        commands::unstar_entry,
        commands::paste,
        commands::get_file_size,
        commands::open_vscode
      ]
    )
    .setup(|app| {
      let handle = app.handle();

      init(&handle);

      let window: tauri::Window = app.get_window("main").unwrap();

      #[cfg(any(windows, target_os = "macos"))]
      {
        set_shadow(&window, true).unwrap();
      }

      #[cfg(debug_assertions)]
      {
        window.open_devtools();
      }

      Ok(())
    })
    .on_page_load(|window, _| {
      let app = window.app_handle();

      let emitter = EventEmitter::new(&app);
      emitter.start_emitting();
    })
    .manage(fs_manager)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
