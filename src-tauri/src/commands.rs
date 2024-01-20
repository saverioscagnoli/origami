extern crate winapi;

use crate::libs::consts::{MONITOR_ENTRY_HEIGHT, MONITOR_SELECTOR_HEIGHT_OFFSET};
use crate::libs::enums::{BackendEvent, WindowLabel};
use crate::utils;
use crate::windows::enum_functions::{self, get_monitor_info, Info, MonitorInfo};

use serde::{Deserialize, Serialize};
use tauri::{Manager, PhysicalPosition, PhysicalSize};
use winapi::shared::minwindef::LPARAM;
use winapi::um::processthreadsapi::{OpenProcess, TerminateProcess};
use winapi::um::winnt::{HANDLE, PROCESS_TERMINATE};
use winapi::um::winuser::EnumWindows;

#[tauri::command]
pub fn kill_process(pid: u32) -> Result<Info, String> {
    unsafe {
        let process_handle: HANDLE = OpenProcess(PROCESS_TERMINATE, 0, pid);

        if process_handle.is_null() {
            eprintln!("Failed to open process: {}", pid);
            return Err("Failed to open process".to_string());
        }

        if TerminateProcess(process_handle, 1) == 0 {
            eprintln!("Failed to terminate process: {}", pid);
        }
    }

    Ok(enum_functions::get_process_and_monitor_info())
}

#[derive(Serialize, Deserialize)]
struct ToggleMonitorSelectorPayload {
    pid: i32,
    monitor_info: Vec<MonitorInfo>,
}

#[tauri::command]
pub fn toggle_monitor_selector(app: tauri::AppHandle, pid: i32, count: i32, i: i32) {
    /*    let window_switcher_win = utils::get_window(&app, WindowLabel::WindowSwitcher);

    let monitor_selector_win = utils::get_window(&app, WindowLabel::MonitorSelector);

    let is_visible = select_monitor_window.is_visible().unwrap();

    let screen_width = utils::get_screen_width();
    let screen_height = utils::get_screen_height();

    let main_win_size = main_win.inner_size().unwrap();

    let main_win_width = main_win_size.width;
    let main_win_height = main_win_size.height;

    let new_height = MONITOR_ENTRY_HEIGHT * count + MONITOR_SELECTOR_HEIGHT_OFFSET;

    if is_visible {
        utils::hide_window(&app, &WindowLabel::MonitorSelector.to_string());
    } else {
        app.emit_all(
            &BackendEvent::ShowMonitorSelector.to_string(),
            &ToggleMonitorSelectorPayload {
                pid,
                monitor_info: get_monitor_info(),
            },
        )
        .unwrap();

        select_monitor_window
            .set_position(PhysicalPosition::new(
                (screen_width / 2) + (main_win_width / 2) as i32,
                (screen_height / 2) - (main_win_height / 2) as i32 + (i * MONITOR_ENTRY_HEIGHT),
            ))
            .unwrap();

        select_monitor_window
            .set_size(PhysicalSize::new(150, new_height as u32))
            .unwrap();

        utils::show_window(&app, &WindowLabel::MonitorSelector.to_string());
    } */
}

#[tauri::command]
pub fn toggle_window_selector(app: tauri::AppHandle) {
    let window_switcher_win = utils::get_window(&app, WindowLabel::WindowSwitcher);

    let window_selector_win = utils::get_window(&app, WindowLabel::WindowSwitcher);

    let is_visible = window_selector_win.is_visible().unwrap();

    let screen_width = utils::get_screen_width();
    let screen_height = utils::get_screen_height();

    let window_switcher_win_size = window_switcher_win.inner_size().unwrap();

    let window_switcher_win_width = window_switcher_win_size.width;
    let window_switcher_win_height = window_switcher_win_size.height;

    if is_visible {
        utils::hide_window(&app, WindowLabel::WindowSelector);
    } else {
        app.emit_all(
            &BackendEvent::ShowWindowSwitcher.to_string(),
            &enum_functions::get_process_and_monitor_info(),
        )
        .unwrap();

        window_selector_win
            .set_position(PhysicalPosition::new(
                (screen_width / 2) + (window_switcher_win_width / 2) as i32,
                (screen_height / 2) - (window_switcher_win_height / 2) as i32,
            ))
            .unwrap();

        utils::show_window(&app, WindowLabel::WindowSelector);
    }
}

pub struct EnumInfoAsLParam {
    pub pid: i32,
    pub monitor_number: i32,
}

#[tauri::command]
pub fn focus_window(app: tauri::AppHandle, pid: i32, monitor_number: i32) {
    unsafe {
        EnumWindows(
            Some(enum_functions::focus_window_callback),
            &EnumInfoAsLParam {
                pid,
                monitor_number,
            } as *const EnumInfoAsLParam as LPARAM,
        );
    }

    utils::hide_all_windows(&app);
}
