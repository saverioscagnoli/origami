// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::Manager;

#[tauri::command]
fn minimize(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    window.minimize().unwrap();
  }
}

#[tauri::command]
fn toggle_maximize(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    if window.is_maximized().unwrap() {
      window.unmaximize().unwrap();
    } else {
      window.maximize().unwrap();
    }
  }
}

#[tauri::command]
fn quit(app: tauri::AppHandle) {
  app.exit(0);
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(tauri::generate_handler![minimize, toggle_maximize, quit])
    .setup(|app| {
      let window = app.get_window("main").unwrap();

      window.open_devtools();

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
