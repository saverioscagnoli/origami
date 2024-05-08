use tauri::{AppHandle, Manager};

use crate::enums::Command;

use super::dir;

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
