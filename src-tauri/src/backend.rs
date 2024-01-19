use tauri::Manager;

use crate::enums::BackendEvent;

pub struct Backend<'a> {
    app: &'a tauri::AppHandle,
}

impl<'a> Backend<'a> {
    pub fn new(app: &'a tauri::AppHandle) -> Self {
        Self { app }
    }

    pub fn switcher_callback(&self) {
        let win = self.app.get_window("main").unwrap();
        let is_visible = win.is_visible().unwrap();

        if is_visible {
            self.app
                .emit_all(&BackendEvent::HideWindowSwitcher.to_string(), "")
                .unwrap();

            win.hide().unwrap();
        } else {
            self.app
                .emit_all(&BackendEvent::ShowWindowSwitcher.to_string(), "")
                .unwrap();

            win.show().unwrap();
            win.set_always_on_top(true).unwrap();
        }
    }
}
