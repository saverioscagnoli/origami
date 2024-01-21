use std::{
    ffi::OsStr,
    io::Cursor,
    mem::{self, MaybeUninit},
    os::windows::ffi::OsStrExt,
    ptr::{addr_of_mut, null_mut},
};

use base64::engine::general_purpose;
use base64::Engine;

use crate::libs::consts::{BANNED_PROCESSES_NAMES, BANNED_PROCESSES_TITLES};
use image::RgbaImage;
use serde::Serialize;
use winapi::{
    ctypes::c_void,
    shared::{
        minwindef::{BOOL, DWORD, LPARAM, MAX_PATH},
        ntdef::HANDLE,
        windef::{HICON, HWND},
    },
    um::{
        processthreadsapi::{OpenProcess, TerminateProcess},
        shellapi::ExtractIconW,
        winbase::QueryFullProcessImageNameW,
        wingdi::{DeleteObject, GetDIBits, GetObjectW, BITMAP, BITMAPINFOHEADER, DIB_RGB_COLORS},
        winnt::{PROCESS_QUERY_INFORMATION, PROCESS_TERMINATE},
        winuser::{
            EnumWindows, GetDC, GetIconInfo, GetWindowTextLengthW, GetWindowTextW,
            GetWindowThreadProcessId, IsWindowVisible, ReleaseDC,
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

        processes.push(Process {
            id: process_id,
            title,
            exe_path,
            icon: unsafe { icon_handle_to_base64(icon_handle) },
        });
    }
    1
}

#[derive(Serialize)]
pub struct Process {
    id: u32,
    title: String,
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
