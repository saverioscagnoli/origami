use std::{ thread, time::Duration };
use serde::{ Deserialize, Serialize };
use tauri::{ AppHandle, Manager };
use std::sync::{ Arc, atomic::{ AtomicBool, Ordering } };

use crate::{
  enums::{ EventFromFrontend, EventToFrontend },
  utils::{ self, emit, once },
};

pub mod commands;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct Disk {
  name: String,
  total: f64,
  free: f64,
  mount_point: String,
  is_removable: bool,
}

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
struct ConstantsPayload {
  is_vscode_installed: bool,
}

pub struct EventEmitter<'a> {
  app: &'a AppHandle,
  should_stop: Arc<AtomicBool>,
}

impl<'a> EventEmitter<'a> {
  pub fn new(app: &'a AppHandle) -> Self {
    Self {
      app,
      should_stop: Arc::new(AtomicBool::new(false)),
    }
  }

  pub fn start_emitting(&self) -> Result<(), String> {
    let app = self.app.clone();
    let should_stop = Arc::clone(&self.should_stop);

    self.load_css_modules()?;
    self.emit_constants()?;

    once(&app, EventFromFrontend::StopEmittingDisks, {
      let should_stop = Arc::clone(&should_stop);
      move |_| {
        should_stop.store(true, Ordering::Relaxed);
      }
    });

    thread::spawn(move || {
      loop {
        if should_stop.load(Ordering::Relaxed) {
          println!("Stopping disk emitter");
          break;
        }

        let disk_emitter = EventEmitter::new(&app);
        disk_emitter.emit_disks().unwrap();
        thread::sleep(Duration::from_secs(1));
      }
    });

    Ok(())
  }

  fn load_css_modules(&self) -> Result<(), String> {
    let path = self.app.path();

    let config_dir = match path.app_config_dir() {
      Ok(dir) => dir,
      Err(e) => {
        return Err(e.to_string());
      }
    };

    let readdir = match std::fs::read_dir(config_dir) {
      Ok(readdir) => readdir,
      Err(e) => {
        return Err(e.to_string());
      }
    };

    for entry in readdir {
      let entry = entry.unwrap();

      let path = entry.path();
      let ext = path.extension();

      if ext.is_some() && ext.unwrap() == "css" {
        let css = match std::fs::read_to_string(&path) {
          Ok(css) => css,
          Err(e) => {
            return Err(e.to_string());
          }
        };

        let css_module = path.file_stem().unwrap().to_str().unwrap();

        println!("Emitting CSS module: {}", css_module);

        emit(&self.app, EventToFrontend::CssModule, &(css_module, css))?;
      }
    }

    Ok(())
  }

  fn emit_constants(&self) -> Result<(), String> {
    let is_vscode_installed = utils::check_vscode_install();

    emit(
      &self.app,
      EventToFrontend::SendConstants,
      &(ConstantsPayload {
        is_vscode_installed,
      })
    )
  }

  fn emit_disks(&self) -> Result<(), String> {
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

      let total = disk.total_space() as f64;
      let free = disk.available_space() as f64;

      disks.push(Disk {
        name: disk.name().to_str().unwrap().to_string(),
        total: f64::trunc(total * 100.0) / 100.0,
        free: f64::trunc(free * 100.0) / 100.0,
        mount_point: mount_point.to_string(),
        is_removable: disk.is_removable(),
      });
    }

    emit(&self.app, EventToFrontend::SendDisks, &disks)
  }
}
