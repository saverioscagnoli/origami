use std::{ thread, time::Duration };

use tauri::Manager;

use crate::{ structs::{ Constants, Disk }, utils::check_vscode_install };

pub struct EventEmitter<'a> {
  app: &'a tauri::AppHandle,
}

impl<'a> EventEmitter<'a> {
  pub fn new(app: &'a tauri::AppHandle) -> Self {
    Self {
      app,
    }
  }

  pub fn start_emitting(&self) {
    let app = self.app.clone();

    thread::spawn(move || {
      let disk_emitter = EventEmitter::new(&app);
      disk_emitter.emit_disks();
    });

    let app = self.app.clone();

    thread::spawn(move || {
      let constants_emitter = EventEmitter::new(&app);
      constants_emitter.emit_constants();
    });
  }

  pub fn emit_disks(&self) {
    loop {
      let mut disks = Vec::new();

      for disk in sysinfo::Disks::new_with_refreshed_list().iter() {
        if disk.file_system() == "vfat" {
          continue;
        }

        // Ignore system mount points
        let mount_point = disk.mount_point().to_str().unwrap();
        if mount_point == "/home" || mount_point == "/boot" {
          continue;
        }

        let total = (disk.total_space() as f64) / 1024.0 / 1024.0 / 1024.0;
        let free = (disk.available_space() as f64) / 1024.0 / 1024.0 / 1024.0;

        disks.push(Disk {
          name: disk.name().to_str().unwrap().to_string(),
          total: f64::trunc(total * 100.0) / 100.0,
          free: f64::trunc(free * 100.0) / 100.0,
          mount_point: mount_point.to_string(),
          is_removable: disk.is_removable(),
        });
      }

      self.app.emit_all("send-disks", &disks).unwrap();
      thread::sleep(Duration::from_secs(1));
    }
  }

  pub fn emit_constants(&self) {
    loop {
      self.app
        .emit_all(
          "send-constants",
          &(Constants {
            is_vscode_installed: check_vscode_install().unwrap(),
          })
        )
        .unwrap();

      thread::sleep(Duration::from_secs(60));
    }
  }
}
