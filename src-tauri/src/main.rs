#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod backend;
mod commands;
mod libs;
mod listener;
mod windows;

use libs::utils;
use listener::HotkeyListener;
use std::thread;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};

fn main() {
    let quit_tray = CustomMenuItem::new("quit", "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit_tray);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::kill_process,
            commands::toggle_monitor_selector,
            commands::focus_window,
            commands::toggle_window_selector
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

            /* #[cfg(debug_assertions)]
            {
                let win = handle.get_window("main").unwrap();
                let select_monitor_win = handle.get_window("select-monitor").unwrap();

                win.open_devtools();
                select_monitor_win.open_devtools();
            } */

            let cloned_handle = handle.clone();

            handle.emit_all("sas", "").unwrap();

            thread::spawn(move || {
                cloned_handle.listen_global("sas", |_| println!("porcodio!!!!"));
            });

            utils::disable_window_transitions_all(&handle);
            utils::enable_window_shadows_all(&handle);

            thread::spawn(move || {
                let listener = HotkeyListener::new(&handle);
                listener.start_listening();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
