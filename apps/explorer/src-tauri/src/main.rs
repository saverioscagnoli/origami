// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{ fs, path::PathBuf, thread, time::Duration };
use chrono::prelude::{ DateTime, Utc };

use globmatch::is_hidden_path;
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

  println!("Starred dir: {:?}", starred_dir);
  println!("Config dir: {:?}", config_dir);

  //let config_file = config_dir.join("config.json");
}

#[derive(Serialize, Deserialize)]
struct DirEntry {
  name: String,
  path: String,
  is_folder: bool,
  is_hidden: bool,
  last_modified: String,
  size: String,
  can_be_opened: bool,
}

#[derive(Serialize, Deserialize)]
struct Disk {
  name: String,
  total: f64,
  free: f64,
  mount_point: String,
  is_removable: bool,
}

fn can_read_dir(path: &PathBuf) -> bool {
  match fs::read_dir(path) {
    Ok(_) => true,
    Err(_) => false,
  }
}

#[tauri::command]
fn read_dir(path: String) -> Vec<DirEntry> {
  let mut entries = Vec::new();

  for entry in fs::read_dir(path).unwrap() {
    let entry = entry.unwrap();
    let path = entry.path();
    let name = entry.file_name();
    let is_folder = path.is_dir();
    let is_hidden = is_hidden_path(&path);

    let can_be_opened = fs::metadata(&path).is_ok();

    let modified = fs::metadata(&path).unwrap().modified().unwrap();
    let datetime: DateTime<Utc> = DateTime::from(modified);

    let size: f64;

    if is_folder {
      size = 0.0;
    } else {
      size = (fs::metadata(&path).unwrap().len() as f64) / 1024.0;
    }

    let size = match size {
      size if size < 1.0 => format!("{:.2} B", size * 1024.0),
      size if size < 1024.0 => format!("{:.2} KB", size),
      size if size >= 1024.0 * 1024.0 => format!("{:.2} GB", size / 1024.0 / 1024.0),
      _ => format!("{:.2} MB", size / 1024.0),
    };

    if is_folder {
      if can_read_dir(&path) {
        entries.push(DirEntry {
          name: name.to_string_lossy().to_string(),
          path: path.to_string_lossy().to_string(),
          is_folder,
          is_hidden,
          last_modified: datetime.format("%d/%m/%Y %H:%M").to_string(),
          size,
          can_be_opened,
        });
      }
    } else {
      entries.push(DirEntry {
        name: name.to_string_lossy().to_string(),
        path: path.to_string_lossy().to_string(),
        is_folder,
        is_hidden,
        last_modified: datetime.format("%d/%m/%Y %H:%M").to_string(),
        size,
        can_be_opened,
      });
    }
  }

  entries
}

#[tauri::command]
fn open_file(path: String) {
  opener::open(path).unwrap_or(());
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

#[tauri::command]
fn create_dir(path: String) {
  fs::create_dir(path).unwrap();
}

#[tauri::command]
fn create_file(path: String) {
  fs::File::create(path).unwrap();
}

#[tauri::command]
fn remove_entry(path: String, is_folder: bool) {
  if is_folder {
    fs::remove_dir_all(path).unwrap();
  } else {
    fs::remove_file(path).unwrap();
  }
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(
      tauri::generate_handler![read_dir, open_file, create_dir, create_file, remove_entry]
    )
    .setup(|app| {
      let handle = app.handle();

      init(&handle);

      let window: tauri::Window = app.get_window("main").unwrap();

      #[cfg(any(windows, target_os = "macos"))]
      set_shadow(&window, true).unwrap();

      #[cfg(debug_assertions)]
      {
        window.open_devtools();
      }

      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
