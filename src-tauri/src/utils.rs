use tauri::{ AppHandle, Manager };

#[tauri::command]
pub fn close_window(app: AppHandle, label: String) {
  let win = app.get_webview_window(label.as_str());

  if win.is_some() {
    win.unwrap().close().unwrap();
  } else {
    log::error!("Window not found: {}", label);
  }
}
