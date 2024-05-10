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

    /**
     * If not error, returns the DirEntry of the created entry.
     * Used to update the frontend, instead of listing the directory again.
     */
    CreateEntry(u64, Option<DirEntry>, Option<String>, bool),

    /**
     * If not error, returns the list of deleted entries.
     * Used to update the frontend, instead of listing the directory again.
     */
    DeleteEntries(u64, Option<String>, Option<String>, bool),

    /**
     * If not error, returns the old path and the new DirEntry.
     */
    RenameEntry(u64, Option<(String, DirEntry)>, Option<String>, bool),

    /**
     * If not error, return the path of each file that was opened.
     */
    OpenFiles(u64, Option<String>, Option<String>, bool),

    /**
     * If not error return the current copied DirEntry
     * (Sent in chunks)
     */
    PasteEntries(u64, Option<DirEntry>, Option<String>, bool),
}

impl Command {
    pub fn as_str(&self) -> &str {
        match self {
            Command::ListDir(_, _, _, _) => "list_dir",
            Command::CreateEntry(_, _, _, _) => "create_entry",
            Command::DeleteEntries(_, _, _, _) => "delete_entries",
            Command::RenameEntry(_, _, _, _) => "rename_entry",
            Command::OpenFiles(_, _, _, _) => "open_files",
            Command::PasteEntries(_, _, _, _) => "paste_entries",
        }
    }

    pub fn emit(&self, app: &AppHandle) {
        match self {
            Command::ListDir(id, data, error, is_finished) => {
                let _ = app.emit(self.as_str(), (id, data, error, is_finished));
            }
            Command::CreateEntry(id, data, error, is_finished) => {
                let _ = app.emit(self.as_str(), (id, data, error, is_finished));
            }
            Command::DeleteEntries(id, deleted, errors, is_finished) => {
                let _ = app.emit(self.as_str(), (id, deleted, errors, is_finished));
            }
            Command::RenameEntry(id, path, error, is_finished) => {
                let _ = app.emit(self.as_str(), (id, path, error, is_finished));
            }
            Command::OpenFiles(id, paths, error, is_finished) => {
                let _ = app.emit(self.as_str(), (id, paths, error, is_finished));
            }
            Command::PasteEntries(id, entry, error, is_finished) => {
                let _ = app.emit(self.as_str(), (id, entry, error, is_finished));
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
