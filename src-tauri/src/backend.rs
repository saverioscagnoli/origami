use tauri::Manager;

use crate::libs::enums::{BackendEvent, WindowLabel};
use crate::libs::utils;
use crate::windows::enum_functions;

pub struct Backend<'a> {
    app: &'a tauri::AppHandle,
}

impl<'a> Backend<'a> {
    pub fn new(app: &'a tauri::AppHandle) -> Self {
        Self { app }
    }

    pub fn listen(&self) {
        self.app.listen_global("seach", |_| println!("asdfasdfasd"));
    }

    pub fn switcher_callback(&self) {
        let window_switcher_win = utils::get_window(self.app, WindowLabel::WindowSwitcher);

        let is_visible = window_switcher_win.is_visible().unwrap();

        if is_visible {
            self.app
                .emit_all(&BackendEvent::HideWindowSwitcher.to_string(), "")
                .unwrap();

            utils::hide_window(self.app, WindowLabel::WindowSwitcher);
            utils::hide_window(self.app, WindowLabel::MonitorSelector);
        } else {
            self.app
                .emit_all(
                    &BackendEvent::ShowWindowSwitcher.to_string(),
                    &enum_functions::get_process_and_monitor_info(),
                )
                .unwrap();

            utils::show_window(self.app, WindowLabel::WindowSwitcher);
        }
    }
}
