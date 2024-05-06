use std::{ sync::{ atomic::{ AtomicBool, Ordering }, Arc }, thread, time::Duration };

use serde::{ Deserialize, Serialize };
use sysinfo::Disks;
use tauri::{ AppHandle, Manager };

use crate::consts::EMIT_DISKS_INTERVAL_SECONDS;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
  pub name: String,
  pub mount_point: String,
  pub file_system: String,
  pub total_space: u64,
  pub free_space: u64,
  pub is_removable: bool,
}

pub fn get_disks() -> Vec<Disk> {
  let sys_disks = Disks::new_with_refreshed_list();
  let mut disks: Vec<Disk> = Vec::new();

  for disk in sys_disks.list() {
    let name = disk.name().to_string_lossy().to_string();
    let mount_point = disk.mount_point().to_string_lossy().to_string();

    if mount_point.starts_with("/boot") || mount_point == "/home" {
      continue;
    }

    let file_system = disk.file_system().to_string_lossy().to_string();
    let total_space = disk.total_space();
    let free_space = disk.available_space();
    let is_removable = disk.is_removable();

    disks.push(Disk {
      name,
      mount_point,
      file_system,
      total_space,
      free_space,
      is_removable,
    });
  }

  disks
}

#[tauri::command]
pub fn poll_disks(app: AppHandle) {
  let sleep_time = Duration::from_secs(EMIT_DISKS_INTERVAL_SECONDS);
  let app = app.clone();

  let should_stop = Arc::new(AtomicBool::new(false));
  let should_stop_clone = Arc::clone(&should_stop);

  let id = app.listen("before_unload", move |_| {
    should_stop.store(true, Ordering::SeqCst);
  });

  thread::spawn(move || {
    loop {
      if should_stop_clone.load(Ordering::SeqCst) {
        app.unlisten(id);
        log::warn!("Stopped disk pool");
        break;
      }

      let disks = get_disks();
      let _ = app.emit("send_disks", disks);

      thread::sleep(sleep_time);
    }
  });
}
