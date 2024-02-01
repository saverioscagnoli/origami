use std::{
    ffi::OsStr,
    io::Cursor,
    mem::{self, MaybeUninit},
    os::windows::ffi::OsStrExt,
    ptr::{addr_of_mut, null_mut},
};

use base64::engine::general_purpose;
use base64::Engine;

use crate::libs::{
    consts::{BANNED_PROCESSES_NAMES, BANNED_PROCESSES_TITLES},
    enums::{BackendEvent, WindowLabel},
    utils,
};
use image::RgbaImage;
use serde::{Deserialize, Serialize};
use winapi::{
    ctypes::c_void,
    shared::{
        minwindef::{BOOL, DWORD, LPARAM, MAX_PATH},
        ntdef::HANDLE,
        windef::{HDC, HICON, HMONITOR, HWND, POINT, RECT},
    },
    um::{
        processthreadsapi::{OpenProcess, TerminateProcess},
        shellapi::ExtractIconW,
        winbase::QueryFullProcessImageNameW,
        wingdi::{DeleteObject, GetDIBits, GetObjectW, BITMAP, BITMAPINFOHEADER, DIB_RGB_COLORS},
        winnt::{PROCESS_QUERY_INFORMATION, PROCESS_TERMINATE},
        winuser::{
            EnumDisplayMonitors, EnumWindows, GetDC, GetIconInfo, GetMonitorInfoW, GetWindowLongW,
            GetWindowRect, GetWindowTextLengthW, GetWindowTextW, GetWindowThreadProcessId,
            IsWindowVisible, MonitorFromPoint, MonitorFromWindow, ReleaseDC, SetForegroundWindow,
            SetWindowPos, ShowWindow, GWL_STYLE, HWND_TOP, MONITORINFO, MONITOR_DEFAULTTONEAREST,
            SWP_SHOWWINDOW, SW_MAXIMIZE, SW_MINIMIZE, SW_RESTORE, WS_MAXIMIZE, WS_MINIMIZE,
        },
    },
};

extern "system" fn get_process_info(hwnd: HWND, _lparam: LPARAM) -> BOOL {
    if unsafe { IsWindowVisible(hwnd) } != 0 {
        let length = unsafe { GetWindowTextLengthW(hwnd) };
        let mut buffer = vec![0u16; length as usize + 1];
        unsafe { GetWindowTextW(hwnd, buffer.as_mut_ptr(), length + 1) };
        let title = String::from_utf16(&buffer).unwrap();

        if title.len() == 1 {
            return 1;
        }

        for banned in BANNED_PROCESSES_TITLES {
            if title.to_lowercase().contains(&banned.to_lowercase()) {
                return 1;
            }
        }

        let mut process_id: DWORD = 0;
        unsafe {
            GetWindowThreadProcessId(hwnd, &mut process_id as *mut DWORD);
        }

        let h_process = unsafe { OpenProcess(PROCESS_QUERY_INFORMATION, 0, process_id) };
        if h_process.is_null() {
            println!("Failed to open process: {}", process_id);
            return 1;
        }

        let mut exe_path = vec![0u16; MAX_PATH + 1];
        let mut path_len = exe_path.len() as u32;
        let success = unsafe {
            QueryFullProcessImageNameW(h_process, 0, exe_path.as_mut_ptr(), &mut path_len)
        };
        if success == 0 {
            println!("Failed to query process image name: {}", process_id);
            return 1;
        }

        let exe_path = String::from_utf16(&exe_path[..path_len as usize]).unwrap();

        for banned in BANNED_PROCESSES_NAMES {
            if exe_path.to_lowercase().contains(&banned.to_lowercase()) {
                return 1;
            }
        }

        let icon_handle = unsafe { get_icon_handle(&exe_path) };

        let processes = unsafe { &mut *(_lparam as *mut Vec<Process>) };

        if processes.iter().any(|p| p.exe_path == exe_path) {
            let process = processes
                .iter_mut()
                .find(|p| p.exe_path == exe_path)
                .unwrap();
            process
                .titles
                .push(title.trim_end_matches('\0').to_string());
            return 1;
        } else {
            processes.push(Process {
                id: process_id,
                titles: vec![title.trim_end_matches('\0').to_string()],
                exe_path,
                icon: unsafe { icon_handle_to_base64(icon_handle) },
            });
        }
    }
    1
}

#[derive(Serialize)]
pub struct Process {
    id: u32,
    titles: Vec<String>,
    exe_path: String,
    icon: String,
}

pub fn list_processes() -> Vec<Process> {
    let mut processes: Vec<Process> = Vec::new();

    unsafe {
        EnumWindows(Some(get_process_info), &mut processes as *mut _ as LPARAM);
    }

    processes
}

pub unsafe fn get_icon_handle(exe_path: &str) -> HICON {
    let wide_exe_path: Vec<u16> = OsStr::new(exe_path).encode_wide().chain(Some(0)).collect();
    let icon_handle = ExtractIconW(null_mut(), wide_exe_path.as_ptr(), 0);

    icon_handle
}

pub unsafe fn icon_handle_to_base64(icon: HICON) -> String {
    let bitmap_size = i32::try_from(mem::size_of::<BITMAP>()).unwrap();
    let biheader_size = u32::try_from(mem::size_of::<BITMAPINFOHEADER>()).unwrap();

    let mut info = MaybeUninit::uninit();
    GetIconInfo(icon, info.as_mut_ptr());
    let info = info.assume_init_ref();
    DeleteObject(info.hbmMask as *mut c_void);

    let mut bitmap: MaybeUninit<BITMAP> = MaybeUninit::uninit();
    let result = GetObjectW(
        info.hbmColor as *mut c_void,
        bitmap_size,
        bitmap.as_mut_ptr().cast(),
    );

    if result != bitmap_size {
        return "".to_string();
    }

    let bitmap = bitmap.assume_init_ref();

    let width = u32::try_from(bitmap.bmWidth).unwrap();
    let height = u32::try_from(bitmap.bmHeight).unwrap();
    let w = usize::try_from(bitmap.bmWidth).unwrap();
    let h = usize::try_from(bitmap.bmHeight).unwrap();

    let buf_size = w
        .checked_mul(h)
        .and_then(|size| size.checked_mul(4))
        .unwrap();
    let mut buf: Vec<u8> = Vec::with_capacity(buf_size);

    let dc = GetDC(null_mut());

    let mut bitmap_info = BITMAPINFOHEADER {
        biSize: biheader_size,
        biWidth: bitmap.bmWidth,
        biHeight: -bitmap.bmHeight,
        biPlanes: 1,
        biBitCount: 32,
        biCompression: 0,
        biSizeImage: 0,
        biXPelsPerMeter: 0,
        biYPelsPerMeter: 0,
        biClrUsed: 0,
        biClrImportant: 0,
    };

    GetDIBits(
        dc,
        info.hbmColor,
        0,
        height,
        buf.as_mut_ptr().cast(),
        addr_of_mut!(bitmap_info).cast(),
        DIB_RGB_COLORS,
    );

    buf.set_len(buf.capacity());

    let result = ReleaseDC(null_mut(), dc);
    assert!(result == 1);
    DeleteObject(info.hbmColor as *mut c_void);

    for chunk in buf.chunks_exact_mut(4) {
        let [b, g, r, a] = chunk else { unreachable!() };
        mem::swap(b, r);
        *g = *g;
        *a = *a;
    }

    let img = RgbaImage::from_vec(width, height, buf).unwrap();

    let mut data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut data), image::ImageOutputFormat::Png)
        .unwrap();

    general_purpose::STANDARD.encode(&data)
}

#[tauri::command]
pub fn kill_process(pid: u32) -> Result<Vec<Process>, String> {
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

    Ok(list_processes())
}

unsafe extern "system" fn enum_monitor_callback(
    hmonitor: HMONITOR,
    _: HDC,
    _: *mut RECT,
    data: LPARAM,
) -> i32 {
    let monitors: &mut Vec<MonitorInfo> = &mut *(data as *mut Vec<MonitorInfo>);

    let mut monitor_info: MONITORINFO = std::mem::zeroed();
    monitor_info.cbSize = std::mem::size_of::<MONITORINFO>() as u32;

    if GetMonitorInfoW(hmonitor, &mut monitor_info as *mut _ as *mut _) != 0 {
        let position = (monitor_info.rcMonitor.left, monitor_info.rcMonitor.top);

        monitors.push(MonitorInfo { position });
    }

    1
}

#[derive(Serialize, Deserialize)]
pub struct MonitorInfo {
    pub position: (i32, i32),
}

impl Clone for MonitorInfo {
    fn clone(&self) -> Self {
        MonitorInfo {
            position: self.position,
        }
    }
}

pub fn get_monitor_info() -> Vec<MonitorInfo> {
    let mut monitors: Vec<MonitorInfo> = Vec::new();

    unsafe {
        EnumDisplayMonitors(
            null_mut(),
            null_mut(),
            Some(enum_monitor_callback),
            &mut monitors as *mut _ as LPARAM,
        );
    }

    monitors
}

pub struct FocusTargetInfo {
    title: Vec<u16>,
    monitor_number: i32,
}

pub unsafe extern "system" fn focus_window_callback(hwnd: HWND, lparam: LPARAM) -> i32 {
    if IsWindowVisible(hwnd) == 0 {
        return 1;
    }

    let params = &mut *(lparam as *mut FocusTargetInfo);

    let target_title = &params.title;
    let target_monitor_number = params.monitor_number;

    let mut title: Vec<u16> = vec![0; 256]; // Buffer for the window title
    GetWindowTextW(hwnd, title.as_mut_ptr(), title.len() as i32);
    title.retain(|&i| i != 0); // Remove trailing null characters

    if title == *target_title {
        let window_style = GetWindowLongW(hwnd, GWL_STYLE) as u32;
        let window_monitor = MonitorFromWindow(hwnd, MONITOR_DEFAULTTONEAREST);

        let monitor_info = get_monitor_info();
        let monitor = monitor_info[target_monitor_number as usize].clone();

        let (x, y) = monitor.position;

        let target_monitor = MonitorFromPoint(POINT { x, y }, MONITOR_DEFAULTTONEAREST);

        let mut rect = std::mem::zeroed();
        GetWindowRect(hwnd, &mut rect);

        let window_width = rect.right - rect.left;
        let window_height = rect.bottom - rect.top;

        if window_monitor != target_monitor {
            if window_style & WS_MAXIMIZE != 0 {
                ShowWindow(hwnd, SW_RESTORE);
                SetWindowPos(
                    hwnd,
                    HWND_TOP,
                    x,
                    y,
                    window_width,
                    window_height,
                    SWP_SHOWWINDOW,
                );
                SetForegroundWindow(hwnd);
                ShowWindow(hwnd, SW_MAXIMIZE);
            } else {
                SetWindowPos(
                    hwnd,
                    HWND_TOP,
                    x,
                    y,
                    window_width,
                    window_height,
                    SWP_SHOWWINDOW,
                );
                ShowWindow(hwnd, SW_RESTORE);
                SetForegroundWindow(hwnd);
            }
        } else {
            SetWindowPos(
                hwnd,
                HWND_TOP,
                rect.left,
                rect.top,
                window_width,
                window_height,
                SWP_SHOWWINDOW,
            );

            if window_style & WS_MAXIMIZE != 0 {
                ShowWindow(hwnd, SW_RESTORE);
                SetForegroundWindow(hwnd);
                ShowWindow(hwnd, SW_MAXIMIZE);
            } else {
                ShowWindow(hwnd, SW_RESTORE);
                SetForegroundWindow(hwnd);
            }
        }
    }

    1
}

#[tauri::command]
pub fn focus_window(app: tauri::AppHandle, window_title: String, monitor_number: i32) {
    let title: Vec<u16> = OsStr::new(&window_title).encode_wide().collect();

    let mut params = FocusTargetInfo {
        title,
        monitor_number,
    };

    unsafe {
        EnumWindows(Some(focus_window_callback), &mut params as *mut _ as LPARAM);
    }

    utils::emit_to_frontend(&app, BackendEvent::HideWindowSwitcher, "");

    let window_selector_win = utils::get_window(&app, WindowLabel::WindowSelector);

    if window_selector_win.is_visible().unwrap() {
        utils::hide_window(&app, WindowLabel::WindowSelector);
        utils::hide_window(&app, WindowLabel::WindowSelector);
    }

    let monitor_selector_win = utils::get_window(&app, WindowLabel::MonitorSelector);

    if monitor_selector_win.is_visible().unwrap() {
        utils::hide_window(&app, WindowLabel::MonitorSelector);
        utils::hide_window(&app, WindowLabel::MonitorSelector);
    }

    utils::hide_window(&app, WindowLabel::WindowSwitcher);
}

pub struct MinimizeTargetInfo {
    title: Vec<u16>,
}

pub unsafe extern "system" fn minimize_window_callback(hwnd: HWND, lparam: LPARAM) -> i32 {
    if IsWindowVisible(hwnd) == 0 {
        return 1;
    }

    let params = &mut *(lparam as *mut MinimizeTargetInfo);

    let target_title = &params.title;

    let mut title: Vec<u16> = vec![0; 256];
    GetWindowTextW(hwnd, title.as_mut_ptr(), title.len() as i32);
    title.retain(|&i| i != 0);

    if title == *target_title {
        ShowWindow(hwnd, SW_MINIMIZE);
    }

    1
}

#[tauri::command]
pub fn minimize_window(app: tauri::AppHandle, title: String) {
    let title: Vec<u16> = OsStr::new(&title).encode_wide().collect();

    let mut params = MinimizeTargetInfo { title };

    unsafe {
        EnumWindows(
            Some(minimize_window_callback),
            &mut params as *mut _ as LPARAM,
        );
    }

    let window_switcher_win = utils::get_window(&app, WindowLabel::WindowSwitcher);

    window_switcher_win.set_focus().unwrap();
}

pub struct MaximizeTargetInfo {
    title: Vec<u16>,
}

pub unsafe extern "system" fn maximize_window_callback(hwnd: HWND, lparam: LPARAM) -> i32 {
    if IsWindowVisible(hwnd) == 0 {
        return 1;
    }

    let params = &mut *(lparam as *mut MaximizeTargetInfo);

    let target_title = &params.title;

    let mut title: Vec<u16> = vec![0; 256];
    GetWindowTextW(hwnd, title.as_mut_ptr(), title.len() as i32);
    title.retain(|&i| i != 0);

    if title == *target_title {
        ShowWindow(hwnd, SW_MAXIMIZE);
    }

    1
}

#[tauri::command]
pub fn maximize_window(app: tauri::AppHandle, title: String) {
    let title: Vec<u16> = OsStr::new(&title).encode_wide().collect();

    let mut params = MinimizeTargetInfo { title };

    unsafe {
        EnumWindows(
            Some(maximize_window_callback),
            &mut params as *mut _ as LPARAM,
        );
    }

    let window_switcher_win = utils::get_window(&app, WindowLabel::WindowSwitcher);

    window_switcher_win.set_focus().unwrap();
}
