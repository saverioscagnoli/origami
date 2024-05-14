use std::{
    sync::{
        atomic::{AtomicBool, Ordering},
        Arc,
    },
    thread,
    time::Duration,
};

use serde::{Deserialize, Serialize};
use tauri::AppHandle;

use crate::{
    consts::POLL_DISKS_INTERVAL_SECONDS,
    enums::{BackendEvent, FrontendEvent},
};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct Disk {
    pub name: String,
    pub mount_point: String,
    pub total_space: u64,
    pub free_space: u64,
    pub is_removable: bool,
    pub file_stem: String,
}

pub fn get_disks() -> Vec<Disk> {
    let sys_disks = sysinfo::Disks::new_with_refreshed_list();
    let mut disks = Vec::new();

    for disk in sys_disks.list() {
        let name = disk.name().to_string_lossy().to_string();
        let mount_point = disk.mount_point().to_string_lossy().to_string();

        /* Skip boot disk and system disks */
        if mount_point.starts_with("/boot") || mount_point == "/home" {
            continue;
        }

        let total_space = disk.total_space();
        let free_space = disk.available_space();
        let is_removable = disk.is_removable();
        let file_stem = disk.file_system().to_string_lossy().to_string();

        disks.push(Disk {
            name,
            mount_point,
            total_space,
            free_space,
            is_removable,
            file_stem,
        });
    }

    disks
}

#[tauri::command]
pub fn poll_disks(app: AppHandle) {
    let sleep_time = Duration::from_secs(POLL_DISKS_INTERVAL_SECONDS);
    let app = app.clone();

    let stop = Arc::new(AtomicBool::new(false));
    let stop_clone = stop.clone();

    let id = FrontendEvent::BeforeUnload().listen(&app, move || {
        stop.store(true, Ordering::SeqCst);
    });

    thread::spawn(move || loop {
        if stop_clone.load(Ordering::SeqCst) {
            app.unlisten(id);
            log::warn!("Stopped disk polling.");
            break;
        }

        let disks = get_disks();

        BackendEvent::SendDisks(disks).emit(&app);

        thread::sleep(sleep_time);
    });
}
