#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod backend;
mod commands;
mod enums;
mod listener;
mod utils;
mod windows;

use std::thread;

use listener::HotkeyListener;
use tauri::{CustomMenuItem, Manager, SystemTray, SystemTrayEvent, SystemTrayMenu};
use window_shadows::set_shadow;

fn main() {
    let quit_tray = CustomMenuItem::new("quit", "Quit");
    let tray_menu = SystemTrayMenu::new().add_item(quit_tray);

    let system_tray = SystemTray::new().with_menu(tray_menu);

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            commands::kill_process,
            commands::toggle_monitor_selector,
            commands::focus_window
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
            let win = handle.get_window("main").unwrap();
            let select_monitor_win = handle.get_window("select-monitor").unwrap();

            #[cfg(debug_assertions)]
            {
                win.open_devtools();
                select_monitor_win.open_devtools();
            }

            utils::disable_window_transitions(&win);
            utils::disable_window_transitions(&select_monitor_win);

            set_shadow(win, true).unwrap();
            set_shadow(select_monitor_win, true).unwrap();

            thread::spawn(move || {
                let listener = HotkeyListener::new(&handle);
                listener.start_listening();
            });

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
