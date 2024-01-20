use std::mem;
use tauri::Manager;
use winapi::{
    ctypes::c_void,
    um::{
        dwmapi::{DwmSetWindowAttribute, DWMWA_TRANSITIONS_FORCEDISABLED},
        winuser::{GetSystemMetrics, SM_CXSCREEN, SM_CYSCREEN},
    },
};
use window_shadows::set_shadow;

use super::{consts::ALL_WINDOW_LABELS, enums::WindowLabel};

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

pub fn get_screen_width() -> i32 {
    unsafe { GetSystemMetrics(SM_CXSCREEN) }
}

pub fn get_screen_height() -> i32 {
    unsafe { GetSystemMetrics(SM_CYSCREEN) }
}

pub fn get_all_windows(app: &tauri::AppHandle) -> Vec<tauri::Window> {
    let mut windows: Vec<tauri::Window> = Vec::new();

    for label in ALL_WINDOW_LABELS {
        let win = app.get_window(label).unwrap();
        windows.push(win)
    }

    windows
}

pub fn get_window(app: &tauri::AppHandle, label: WindowLabel) -> tauri::Window {
    app.get_window(&label.to_string()).unwrap()
}

pub fn hide_all_windows(app: &tauri::AppHandle) {
    for label in ALL_WINDOW_LABELS {
        let win = app.get_window(label).unwrap();

        win.hide().unwrap();
    }
}

pub fn show_window(app: &tauri::AppHandle, label: WindowLabel) {
    let win = get_window(app, label);

    win.show().unwrap();
    win.set_focus().unwrap();
}

pub fn hide_window(app: &tauri::AppHandle, label: WindowLabel) {
    let win = get_window(app, label);
    
    win.hide().unwrap();
}

pub fn disable_window_transitions_all(app: &tauri::AppHandle) {
    for win in get_all_windows(app) {
        disable_window_transitions(&win);
    }
}

pub fn enable_window_shadows_all(app: &tauri::AppHandle) {
    for win in get_all_windows(app) {
        set_shadow(win, true).unwrap();
    }
}
