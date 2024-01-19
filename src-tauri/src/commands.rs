extern crate winapi;
use winapi::um::processthreadsapi::{OpenProcess, TerminateProcess};
use winapi::um::winnt::{HANDLE, PROCESS_TERMINATE};

use crate::windows::enum_functions::{self, Info};

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
