use super::{dir, file};
use crate::{consts::STARRED_DIR_NAME, enums::Command};
use std::path::Path;
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn list_dir(app: AppHandle, dir: String, id: u64) {
    tokio::spawn(async move {
        let path = app.path();
        let app_config_dir = path.app_config_dir().unwrap();

        let entries = dir::list_dir(&dir, app_config_dir).await;

        match entries {
            Ok(entries) => {
                Command::ListDir(id, Some((dir.clone(), entries)), None, true).emit(&app);
                log::info!("Listed directory: {:?}", dir);
            }

            Err(err) => {
                Command::ListDir(id, None, Some(err.to_string()), true).emit(&app);
                log::error!("Failed to list directory: {:?}", dir);
            }
        }
    });
}

#[tauri::command]
pub async fn create_entry(app: AppHandle, path: String, is_dir: bool, id: u64) {
    tokio::spawn(async move {
        let res = if is_dir {
            dir::create_dir(&path).await
        } else {
            file::create_file(&path).await
        };

        match res {
            Ok(_) => {
                let path_resolver = app.path();

                let starred_dir = path_resolver
                    .app_config_dir()
                    .unwrap()
                    .join(STARRED_DIR_NAME);

                let entry = super::into_entry(&path, starred_dir);

                if entry.is_none() {
                    Command::CreateEntry(
                        id,
                        None,
                        Some("Failed to create entry".to_string()),
                        true,
                    )
                    .emit(&app);

                    log::error!("Failed to create entry: {:?}", path);
                    return;
                }

                let entry = entry.unwrap();

                Command::CreateEntry(id, Some(entry), None, true).emit(&app);
                log::info!("Created entry: {:?}", path);
            }

            Err(err) => {
                Command::CreateEntry(id, None, Some(err.to_string()), true).emit(&app);
                log::error!("Failed to create entry: {:?}", path);
            }
        }
    });
}

#[tauri::command]
pub async fn delete_entries(app: AppHandle, paths: Vec<String>, id: u64) {
    tokio::spawn(async move {
        for (i, path) in paths.iter().enumerate() {
            let path_buf = Path::new(&path);
            let path_clone = path.clone();

            let is_last = i == paths.len() - 1;

            let res = if path_buf.is_dir() {
                dir::delete_dir(&path).await
            } else {
                file::delete_file(&path).await
            };

            match res {
                Ok(_) => {
                    Command::DeleteEntries(id, Some(path.to_string()), None, is_last).emit(&app);
                    log::info!("Deleted entry: {:?}", path_clone);
                }

                Err(err) => {
                    Command::DeleteEntries(id, None, Some(err.to_string()), is_last).emit(&app);
                    log::error!("Failed to delete entry: {:?}", path);
                }
            }
        }
    });
}
