use std::sync::mpsc::Receiver;

use serde::Serialize;
use tauri::Manager;

use crate::libs::{
    enums::{BackendEvent, HotKeyName, WindowLabel},
    utils,
};

use crate::funcs::processes;

pub struct Backend<'a> {
    app: &'a tauri::AppHandle,
    receiver: Receiver<HotKeyName>,
}

impl<'a> Backend<'a> {
    pub fn new(app: &'a tauri::AppHandle, receiver: Receiver<HotKeyName>) -> Self {
        Self { app, receiver }
    }

    pub fn start_listening(&self) {
        for name in &self.receiver {
            match name {
                HotKeyName::WindowSwitcher => self.window_switcher_callback(),
            }
        }
    }

    fn emit_to_frontend<F: Serialize>(&self, event: BackendEvent, data: F) {
        self.app.emit_all(event.as_str(), &data).unwrap();
    }

    fn window_switcher_callback(&self) {
        let window_switcher_win = utils::get_window(self.app, WindowLabel::WindowSwitcher);
        let is_window_switcher_visible = window_switcher_win.is_visible().unwrap();

        if is_window_switcher_visible {
            self.emit_to_frontend(BackendEvent::HideWindowSwitcher, "");
            self.emit_to_frontend(BackendEvent::HideWindowSelector, "");
            self.emit_to_frontend(BackendEvent::HideMonitorSelector, "");

            utils::hide_window(self.app, WindowLabel::WindowSwitcher);
            utils::hide_window(self.app, WindowLabel::WindowSelector);
            utils::hide_window(self.app, WindowLabel::MonitorSelector);
        } else {
            processes::list_processes();
            self.emit_to_frontend(BackendEvent::ShowWindowSwitcher, processes::list_processes());

            utils::show_window(self.app, WindowLabel::WindowSwitcher);
        }
    }
}
