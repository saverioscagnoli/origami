extern crate winapi;

use base64::engine::general_purpose;
use base64::Engine;
use image::RgbaImage;
use serde::{Deserialize, Serialize};
use std::collections::HashMap;
use std::ffi::OsStr;
use std::io::Cursor;
use std::mem::{self, MaybeUninit};
use std::os::windows::ffi::OsStrExt;
use std::ptr::{addr_of_mut, null_mut};
use winapi::ctypes::c_void;
use winapi::shared::minwindef::{BOOL, LPARAM};
use winapi::shared::windef::{HDC, HICON, HMONITOR, HWND, POINT, RECT};
use winapi::um::processthreadsapi::OpenProcess;
use winapi::um::psapi::GetModuleFileNameExW;
use winapi::um::shellapi::ExtractIconW;
use winapi::um::wingdi::{
    DeleteObject, GetDIBits, GetObjectW, BITMAP, BITMAPINFOHEADER, DIB_RGB_COLORS,
};
use winapi::um::winnt::{PROCESS_QUERY_INFORMATION, PROCESS_VM_READ};
use winapi::um::winuser::{
    EnumDisplayMonitors, GetDC, GetIconInfo, GetWindowLongW, GetWindowRect,
    GetWindowThreadProcessId, MonitorFromPoint, MonitorFromWindow, ReleaseDC, SetForegroundWindow,
    SetWindowPos, ShowWindow, GWL_STYLE, HWND_TOP, MONITORINFO, MONITOR_DEFAULTTONEAREST,
    SWP_SHOWWINDOW, SW_MAXIMIZE, SW_RESTORE, WS_MAXIMIZE,
};
use winapi::um::winuser::{EnumWindows, GetMonitorInfoW, GetWindowTextW, IsWindowVisible};

use crate::commands::EnumInfoAsLParam;

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

#[derive(Debug, Serialize, Deserialize)]
pub struct ProcessInfo {
    pub id: u32,
    pub window_titles: Vec<String>,
    pub exe_path: String,
    pub icon: String,
}
extern "system" fn list_process_ids_callback(hwnd: HWND, lparam: LPARAM) -> BOOL {
    unsafe {
        if IsWindowVisible(hwnd) == 0 {
            return 1;
        }

        let mut process_id: u32 = 0;
        GetWindowThreadProcessId(hwnd, &mut process_id as *mut u32);

        let mut title: [u16; 256] = [0; 256];
        GetWindowTextW(hwnd, title.as_mut_ptr(), 256);

        let title = String::from_utf16_lossy(&title);

        let process_handle =
            OpenProcess(PROCESS_QUERY_INFORMATION | PROCESS_VM_READ, 0, process_id);

        let mut exe_path: [u16; 256] = [0; 256];
        GetModuleFileNameExW(process_handle, null_mut(), exe_path.as_mut_ptr(), 256);

        let exe_path = String::from_utf16_lossy(&exe_path);

        let icon_handle = get_icon_handle(&exe_path);
        let icon = icon_handle_to_base64(icon_handle);

        let processes_info = &mut *(lparam as *mut Vec<ProcessInfo>);

        processes_info.push(ProcessInfo {
            id: process_id,
            window_titles: vec![title.trim_end_matches('\0').to_string()],
            exe_path: exe_path.trim_end_matches('\0').to_string(),
            icon,
        });

        1
    }
}

pub fn get_open_windows() -> Vec<ProcessInfo> {
    let mut processes_info: Vec<ProcessInfo> = Vec::new();

    unsafe {
        EnumWindows(
            Some(list_process_ids_callback),
            &mut processes_info as *mut _ as LPARAM,
        );
    }

    let mut pid_to_info: HashMap<u32, ProcessInfo> = HashMap::new();

    for info in processes_info {
        if vec![
            "ApplicationFrameHost.exe",
            "TextInputHost.exe",
            "ApplicationFrameHost.exe",
            "SystemSettings.exe",
        ]
        .contains(&info.exe_path.as_str().split("\\").last().unwrap())
        {
            continue;
        }

        pid_to_info
            .entry(info.id)
            .or_insert_with(|| ProcessInfo {
                id: info.id,
                window_titles: Vec::new(),
                exe_path: info.exe_path.clone(),
                icon: info.icon.clone(),
            })
            .window_titles
            .extend(info.window_titles);
    }

    let mut filtered_infos: Vec<ProcessInfo> = pid_to_info
        .into_iter()
        .map(|(_, info)| info)
        .filter(|i| !i.window_titles.contains(&"".to_string()))
        .collect();

    filtered_infos.sort_by(|a, b| a.window_titles[0].cmp(&b.window_titles[0]));

    filtered_infos
}

#[derive(Serialize, Deserialize)]
pub struct Info {
    pub process_info: Vec<ProcessInfo>,
    pub monitor_info: Vec<MonitorInfo>,
}

pub fn get_process_and_monitor_info() -> Info {
    let process_info = get_open_windows();
    let monitor_info = get_monitor_info();

    let info = Info {
        process_info,
        monitor_info,
    };

    info
}

pub unsafe extern "system" fn focus_window_callback(hwnd: HWND, lparam: LPARAM) -> i32 {
    if IsWindowVisible(hwnd) == 0 {
        return 1;
    }

    let params = &mut *(lparam as *mut EnumInfoAsLParam);

    let target_process_id = params.pid;
    let target_monitor_number = params.monitor_number;

    let mut process_id = 0;

    GetWindowThreadProcessId(hwnd, &mut process_id);

    if process_id == target_process_id as u32 {
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
        let [b, _, r, _] = chunk else { unreachable!() };
        mem::swap(b, r);
    }

    let img = RgbaImage::from_vec(width, height, buf).unwrap();

    let mut data: Vec<u8> = Vec::new();
    img.write_to(&mut Cursor::new(&mut data), image::ImageOutputFormat::Png)
        .unwrap();

    general_purpose::STANDARD.encode(&data)
}
