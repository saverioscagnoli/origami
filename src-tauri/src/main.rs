#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod funcs;
mod hotkey_listener;
mod libs;
mod window_manager;

use funcs::processes::kill_process;
use hotkey_listener::Listener;
use libs::utils;
use std::{sync::mpsc, thread};
use tauri::{CustomMenuItem, SystemTray, SystemTrayEvent, SystemTrayMenu};
use window_manager::WindowManager;
use window_manager::{hide_window_selector, show_window_selector};

fn main() {
    let quit_tray = CustomMenuItem::new("quit", "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit_tray);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            kill_process,
            show_window_selector,
            hide_window_selector
        ])
        .system_tray(system_tray)
        .on_system_tray_event(|app, event| {
            if let SystemTrayEvent::MenuItemClick { id, .. } = event {
                if id == "quit" {
                    app.exit(0);
                }
            }
        })
        .setup(|app| {
            let handle = app.handle();

            utils::disable_window_transitions_all(&handle);
            utils::enable_window_shadows_all(&handle);

            let (sender, receiver) = mpsc::channel();

            thread::spawn(move || {
                let listener = Listener::new(sender);
                listener.start_loop();
            });

            thread::spawn(move || {
                let window_manager = WindowManager::new(&handle, receiver);
                window_manager.start_listening();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
