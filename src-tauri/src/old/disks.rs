use std::{ sync::atomic::{ AtomicBool, Ordering }, thread, time::Duration };

use sysinfo::Disks;
use tauri::{ AppHandle, State };
use std::sync::{ Arc, Mutex };

use crate::{
  consts::EMIT_DISKS_INTERVAL_SECONDS,
  events::{ EventFromFrontend, EventToFrontend },
  structs::Disk,
  utils::{ emit, listen },
};

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
pub fn emit_disks(app: AppHandle) -> Result<(), String> {
  let sleep_time = Duration::from_secs(EMIT_DISKS_INTERVAL_SECONDS);
  let app = app.clone();

  let should_stop = Arc::new(AtomicBool::new(false));
  let should_stop_clone = Arc::clone(&should_stop);

  let id = listen::<Option<bool>>(&app, EventFromFrontend::BeforeUnload, move |_| {
    should_stop.store(true, Ordering::SeqCst);
  });

  thread::spawn(move || {
    loop {
      if should_stop_clone.load(Ordering::SeqCst) {
        app.unlisten(id);
        break;
      }

      let disks = get_disks();

      emit(&app, EventToFrontend::SendDisks, disks);

      thread::sleep(sleep_time);
    }

    println!("Stopping disks thread");
  });

  Ok(())
}