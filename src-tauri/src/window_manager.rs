use std::sync::mpsc::Receiver;

use tauri::{PhysicalPosition, PhysicalSize};

use crate::libs::{
    consts::{
        FRONTEND_ENTRY_HEIGHT, SECONDARY_WINDOW_WIDTH, WINDOW_SWITCHER_HEIGHT,
        WINDOW_SWITCHER_WIDTH,
    },
    enums::{BackendEvent, HotKeyName, WindowLabel},
    utils,
};

use crate::funcs::processes;

pub struct WindowManager<'a> {
    app: &'a tauri::AppHandle,
    receiver: Receiver<HotKeyName>,
}

impl<'a> WindowManager<'a> {
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

    fn window_switcher_callback(&self) {
        let window_switcher_win = utils::get_window(self.app, WindowLabel::WindowSwitcher);
        let is_window_switcher_visible = window_switcher_win.is_visible().unwrap();

        if is_window_switcher_visible {
            utils::emit_to_frontend(self.app, BackendEvent::HideWindowSwitcher, "");
            utils::emit_to_frontend(self.app, BackendEvent::HideWindowSelector, "");
            utils::emit_to_frontend(self.app, BackendEvent::HideMonitorSelector, "");

            utils::hide_window(self.app, WindowLabel::WindowSwitcher);
            utils::hide_window(self.app, WindowLabel::WindowSelector);
            utils::hide_window(self.app, WindowLabel::MonitorSelector);
        } else {
            processes::list_processes();
            utils::emit_to_frontend(
                self.app,
                BackendEvent::ShowWindowSwitcher,
                processes::list_processes(),
            );

            utils::show_window(self.app, WindowLabel::WindowSwitcher);
        }
    }
}

#[tauri::command]
pub fn show_window_selector(app: tauri::AppHandle, titles: Vec<String>, index: i32) {
    let window_selector_win = utils::get_window(&app, WindowLabel::WindowSelector);

    let new_height = FRONTEND_ENTRY_HEIGHT * titles.len() as i32;

    window_selector_win
        .set_size(PhysicalSize::new(SECONDARY_WINDOW_WIDTH, new_height as u32))
        .unwrap();

    let screen_width = utils::get_screen_width();
    let scren_height = utils::get_screen_height();

    let x = (screen_width / 2) + WINDOW_SWITCHER_WIDTH / 2;
    let y = (scren_height - WINDOW_SWITCHER_HEIGHT) / 2 + ((index + 1) * 48);

    window_selector_win
        .set_position(PhysicalPosition::new(x, y))
        .unwrap();

    utils::emit_to_frontend(&app, BackendEvent::ShowWindowSelector, titles);
    utils::show_window(&app, WindowLabel::WindowSelector);
}

#[tauri::command]
pub fn hide_window_selector(app: tauri::AppHandle) {
    utils::emit_to_frontend(&app, BackendEvent::HideWindowSelector, "");
    utils::hide_window(&app, WindowLabel::WindowSelector);
}
