/*
 * In this file there are all the functions regarding the app window and its states, such as:
 * creating new window, closing windows, etc...
 */

use tauri::{AppHandle, Manager, WebviewUrl, WebviewWindowBuilder};

#[tauri::command]
pub async fn spawn_main_window(app: AppHandle) {
    let mut i = 0;
    let mut label = format!("main-{}", i);

    let mut win = app.get_webview_window(&label);

    while win.is_some() {
        i += 1;
        label = format!("main-{}", i);
        win = app.get_webview_window(&label);
    }

    let _ = WebviewWindowBuilder::new(&app, label, WebviewUrl::App("index.html".into()))
        .decorations(false)
        .title("origami")
        .build();
}

#[tauri::command]
pub async fn close_all_windows(app: AppHandle) {
    app.exit(1);
}

pub async fn spawn_copy_window(app: &AppHandle) -> tauri::WebviewWindow {
    let mut i = 0;
    let mut label = format!("copy-{}", i);

    let mut win = app.get_webview_window(&label);

    while win.is_some() {
        i += 1;
        label = format!("copy-{}", i);
        win = app.get_webview_window(&label);
    }

    WebviewWindowBuilder::new(app, label, WebviewUrl::App("copy.html".into()))
        .inner_size(400.0, 200.0)
        .title("Copy files")
        .build()
        .unwrap()
}
