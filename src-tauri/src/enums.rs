use crate::{disks::Disk, file_system::DirEntry};
use serde::{Deserialize, Serialize};
use tauri::{AppHandle, Manager};

/**
 * This is for all the backend commands.
 * Every command can hold 2 Optional Values, similar to a Tuple or the Rust Result Enum.
 * The first value is the data that the command is supposed to return.
 * The second value is an error message, to display to the fronted.
 * The Command shouldnt have 2 values at the same time.
 *
 * The third value is a boolean, to indicate if the command is finished or not.
 * I.E, if the list_dir command is reading a very large directory, it can return the data in chunks.
 */

#[derive(Serialize, Deserialize, Debug)]
#[serde(rename_all = "camelCase")]
pub enum Command {
    ListDir(u64, Option<(String, Vec<DirEntry>)>, Option<String>, bool),
}

impl Command {
    pub fn as_str(&self) -> &str {
        match self {
            Command::ListDir(_, _, _, _) => "list_dir",
        }
    }

    pub fn emit(&self, app: &AppHandle) {
        match self {
            Command::ListDir(id, data, error, is_finished) => {
                let _ = app.emit(self.as_str(), (id, data, error, is_finished));
            }
        }
    }
}

/**
 * This is for the events that get emitted from the backend to the frontend.
 *
 * The payload can be of any type, and the frontend should be able to handle it.
 */

#[derive(Serialize, Deserialize, Debug)]
pub enum BackendEvent {
    SendDisks(Vec<Disk>),
}

impl BackendEvent {
    pub fn as_str(&self) -> &str {
        match self {
            BackendEvent::SendDisks(_) => "send_disks",
        }
    }

    pub fn emit(&self, app: &AppHandle) {
        match self {
            BackendEvent::SendDisks(disks) => {
                let _ = app.emit(self.as_str(), disks);
            }
        }
    }
}

pub enum FrontendEvent {
    BeforeUnload(),
}

impl FrontendEvent {
    pub fn as_str(&self) -> &str {
        match self {
            FrontendEvent::BeforeUnload() => "before_unload",
        }
    }

    pub fn listen<F>(&self, app: &AppHandle, callback: F) -> tauri::EventId
    where
        F: Fn() + Send + Sync + 'static,
    {
        app.listen(self.as_str(), move |_| {
            callback();
        })
    }
}
