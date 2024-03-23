// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{ Deserialize, Serialize };
use sysinfo::Disks;
use tauri::Manager;

#[tauri::command]
fn minimize(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    window.minimize().unwrap();
  }
}

#[tauri::command]
fn toggle_maximize(app: tauri::AppHandle) {
  if let Some(window) = app.get_window("main") {
    if window.is_maximized().unwrap() {
      window.unmaximize().unwrap();
    } else {
      window.maximize().unwrap();
    }
  }
}

#[tauri::command]
fn quit(app: tauri::AppHandle) {
  app.exit(0);
}

#[derive(Serialize, Deserialize)]
struct Disk {
  available_space: u64,
  total_space: u64,
}

#[tauri::command]
fn list_disks() -> Vec<Disk> {
  let mut disks: Vec<Disk> = Vec::new();
  for disk in Disks::new_with_refreshed_list().list() {
    if disk.file_system() != "vfat" {
      disks.push(Disk {
        available_space: disk.available_space() / (1024 * 1024 * 1024),
        total_space: disk.total_space() / (1024 * 1024 * 1024),
      });
    }
  }

  disks
}

fn main() {
  tauri::Builder
    ::default()
    .invoke_handler(tauri::generate_handler![minimize, toggle_maximize, quit, list_disks])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
