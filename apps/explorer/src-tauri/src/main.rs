// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use api::Api;
use tauri::Manager;

mod api;
mod event_emitter;
mod enums;
mod utils;

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(
      tauri::generate_handler![
        api::commands::request_dir_listing,
        api::commands::open_file,
        api::commands::star_entry,
        api::commands::unstar_entry,
        api::commands::cut_entry,
        api::commands::copy_entry,
        api::commands::rename_entry,
        api::commands::delete_entry,
        event_emitter::commands::init_emitter
      ]
    )
    .setup(|app| {
      let handle = app.handle();
      let path = handle.path();
      let config_dir = path.app_config_dir()?;

      let api = Api::new(config_dir);

      api.init();

      app.manage(api);

      Ok(())
    })
    .on_page_load(|_window, _| {
      #[cfg(debug_assertions)]
      {
        _window.open_devtools()
      }
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
