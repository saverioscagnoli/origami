// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use api::Api;
use size::SizeCalculator;
use tauri::Manager;

mod api;
mod event_emitter;
mod enums;
mod utils;
mod size;

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
        api::commands::create_entry,
        api::commands::rename_entry,
        api::commands::delete_entry,
        size::commands::calc_size,
        event_emitter::commands::init_emitter,
        event_emitter::commands::open_in_vscode
      ]
    )
    .setup(|app| {
      let handle = app.handle();
      let path = handle.path();
      let config_dir = path.app_config_dir()?;

      let api = Api::new(config_dir);

      println!("API initialized {}", utils::check_vscode_install());

      api.init();

      let app_clone = handle.clone();

      let size_calculator = SizeCalculator::new(app_clone);

      size_calculator.listen();

      app.manage(api);
      app.manage(size_calculator);

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
