extern crate winapi;

use serde::{Deserialize, Serialize};
use tauri::{Manager, PhysicalPosition, PhysicalSize};
use winapi::shared::minwindef::LPARAM;
use winapi::um::processthreadsapi::{OpenProcess, TerminateProcess};
use winapi::um::winnt::{HANDLE, PROCESS_TERMINATE};
use winapi::um::winuser::EnumWindows;

use crate::enums::{BackendEvent, Consts};
use crate::utils;
use crate::windows::enum_functions::{self, get_monitor_info, Info, MonitorInfo};

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
    let main_win = app.get_window("main").unwrap();
    let select_monitor_window = app.get_window("select-monitor").unwrap();
    let is_visible = select_monitor_window.is_visible().unwrap();

    let screen_width = utils::get_screen_width();
    let screen_height = utils::get_screen_height();

    let main_win_width = main_win.inner_size().unwrap().width;
    let main_win_height = main_win.inner_size().unwrap().height;

    let new_height = Consts::MonitorEntryHeight as i32 * count + 25;

    if is_visible {
        select_monitor_window.hide().unwrap();
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
                (screen_height / 2) - (main_win_height / 2) as i32
                    + (i * Consts::MonitorEntryHeight as i32),
            ))
            .unwrap();

        select_monitor_window
            .set_size(PhysicalSize::new(150, new_height as u32))
            .unwrap();

        select_monitor_window.show().unwrap();
        select_monitor_window.set_focus().unwrap();
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

    let main_win = app.get_window("main").unwrap();
    let select_monitor_window = app.get_window("select-monitor").unwrap();

    main_win.hide().unwrap();
    select_monitor_window.hide().unwrap();
}
