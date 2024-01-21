use std::mem;

use tauri::Manager;
use winapi::{
    ctypes::c_void,
    um::dwmapi::{DwmSetWindowAttribute, DWMWA_TRANSITIONS_FORCEDISABLED},
};
use window_shadows::set_shadow;

use super::enums::WindowLabel;

pub fn get_window(app: &tauri::AppHandle, label: WindowLabel) -> tauri::Window {
    let win = app.get_window(label.as_str());

    if let Some(win) = win {
        win
    } else {
        panic!(
            "Window not found, there is a wrong label: {}",
            label.as_str()
        );
    }
}

pub fn get_all_windows(app: &tauri::AppHandle) -> Vec<tauri::Window> {
    let mut windows: Vec<tauri::Window> = Vec::new();

    for label in WindowLabel::iter() {
        let win = get_window(app, label);
        windows.push(win);
    }

    windows
}

pub fn show_window(app: &tauri::AppHandle, label: WindowLabel) {
    let win = app.get_window(label.as_str());

    if let Some(win) = win {
        win.show().unwrap();
        win.set_focus().unwrap();
    } else {
        panic!(
            "Window not found, there is a wrong label: {}",
            label.as_str()
        );
    }
}

pub fn hide_window(app: &tauri::AppHandle, label: WindowLabel) {
    let win = app.get_window(label.as_str());

    if let Some(win) = win {
        win.hide().unwrap();
    } else {
        panic!(
            "Window not found, there is a wrong label: {}",
            label.as_str()
        );
    }
}

pub fn disable_window_transitions(win: &tauri::Window) {
    let hwnd = win.hwnd().unwrap();

    unsafe {
        DwmSetWindowAttribute(
            mem::transmute(hwnd),
            DWMWA_TRANSITIONS_FORCEDISABLED,
            &1 as *const i32 as *mut c_void,
            mem::size_of::<i32>() as u32,
        );
    }
}

pub fn disable_window_transitions_all(app: &tauri::AppHandle) {
    let windows = get_all_windows(app);

    for win in windows {
        disable_window_transitions(&win);
    }
}

pub fn enable_window_shadows_all(app: &tauri::AppHandle) {
    let windows = get_all_windows(app);

    for win in windows {
        set_shadow(win, true).unwrap();
    }
}
