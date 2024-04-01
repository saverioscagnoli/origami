#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod fs_manager;
mod commands;
mod utils;

use std::{ env, fs, thread, time::Duration };
use fs_manager::FSManager;
use serde::{ Deserialize, Serialize };
use tauri::Manager;
use window_shadows::set_shadow;

fn init(app: &tauri::AppHandle) {
  let clone = app.clone();

  thread::spawn(move || {
    list_disks(&clone);
  });

  let path_resolver = app.path_resolver();
  let config_dir = path_resolver.app_config_dir().unwrap();

  let starred_dir = config_dir.join("starred");

  if !starred_dir.exists() {
    fs::create_dir_all(&starred_dir).unwrap();
  }

  //let config_file = config_dir.join("config.json");
}

#[derive(Serialize, Deserialize)]
struct Disk {
  name: String,
  total: f64,
  free: f64,
  mount_point: String,
  is_removable: bool,
}

fn list_disks(app: &tauri::AppHandle) -> Vec<Disk> {
  loop {
    let mut disks = Vec::new();

    for disk in sysinfo::Disks::new_with_refreshed_list().iter() {
      let total = (disk.total_space() as f64) / 1024.0 / 1024.0 / 1024.0;
      let free = (disk.available_space() as f64) / 1024.0 / 1024.0 / 1024.0;

      disks.push(Disk {
        name: disk.name().to_str().unwrap().to_string(),
        total: f64::trunc(total * 100.0) / 100.0,
        free: f64::trunc(free * 100.0) / 100.0,
        mount_point: disk.mount_point().to_str().unwrap().to_string(),
        is_removable: disk.is_removable(),
      });
    }

    app.emit_all("send-disks", &disks).unwrap();
    thread::sleep(Duration::from_secs(1));
  }
}

fn main() {
  let fs_manager = FSManager::new();

  tauri::Builder
    ::default()
    .invoke_handler(
      tauri::generate_handler![
        commands::read_dir,
        commands::open_file,
        commands::create_entry,
        commands::delete_entry,
        commands::star_entry,
        commands::unstar_entry,
        commands::paste
      ]
    )
    .setup(|app| {
      let handle = app.handle();

      init(&handle);

      let window: tauri::Window = app.get_window("main").unwrap();

      #[cfg(any(windows, target_os = "macos"))]
      {
        set_shadow(&window, true).unwrap();
      }

      #[cfg(debug_assertions)]
      {
        window.open_devtools();
      }

      Ok(())
    })
    .manage(fs_manager)
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
