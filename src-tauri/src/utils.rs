use tauri::{ AppHandle, Manager, WebviewUrl, WebviewWindowBuilder };

#[tauri::command]
pub fn close_window(app: AppHandle, label: String) {
  let win = app.get_webview_window(label.as_str());

  if win.is_some() {
    win.unwrap().close().unwrap();
  } else {
    log::error!("Window not found: {}", label);
  }
}

#[tauri::command]
pub async fn create_window(app: AppHandle) -> Result<(), ()> {
  let mut n = 1;
  let mut label = format!("main-{}", n);

  while app.get_webview_window(label.as_str()).is_some() {
    n += 1;
    label = format!("main-{}", n);
  }

  let win = WebviewWindowBuilder::new(
    &app,
    label,
    WebviewUrl::App("index.html".into())
  )
    .decorations(false)

    .build();

  if win.is_ok() {
    win.unwrap();
  } else {
    log::error!("Failed to create window: {}", win.err().unwrap());
  }

  Ok(())
}


#[tauri::command]
pub fn close_all_windows(app: AppHandle) {
  app.exit(0)
}

