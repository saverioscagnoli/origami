use std::mem;

use winapi::{
    ctypes::c_void,
    um::{
        dwmapi::{DwmSetWindowAttribute, DWMWA_TRANSITIONS_FORCEDISABLED},
        winuser::{GetSystemMetrics, SM_CXSCREEN, SM_CYSCREEN},
    },
};

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
