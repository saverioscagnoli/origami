#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod listener;
mod backend;
mod enums;

use std::thread;

use listener::HotkeyListener;
use tauri::Manager;
use window_shadows::set_shadow;

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![])
        .setup(|app| {
            let handle = app.handle();
            let win = handle.get_window("main").unwrap();

            set_shadow(win, true).unwrap();

            thread::spawn(move || {
                let listener = HotkeyListener::new(&handle);
                listener.start_listening();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
