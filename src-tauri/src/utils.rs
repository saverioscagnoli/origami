use std::path::PathBuf;

use tauri::{AppHandle, Manager};

use crate::consts::{INDEX_FILE_NAME, SETTINGS_FILE_NAME, STARRED_DIR_NAME};

pub struct AppPaths {
    pub starred_dir: PathBuf,
    pub settings_file: PathBuf,
    pub index_file: PathBuf,
}

pub fn get_starred_dir(app: &AppHandle) -> PathBuf {
    let path = app.path();
    path.app_config_dir().unwrap().join(STARRED_DIR_NAME)
}

pub fn get_settings_file(app: &AppHandle) -> PathBuf {
    let path = app.path();
    path.app_config_dir().unwrap().join(SETTINGS_FILE_NAME)
}

pub fn get_index_file(app: &AppHandle) -> PathBuf {
    let path = app.path();
    path.app_config_dir().unwrap().join(INDEX_FILE_NAME)
}

/**
 * Retrieves all the paths used by the app.
 * - Starred directory: ~/CONFIG_DIR/origami/Starred
 * - Settings file: ~/CONFIG_DIR/origami/settings.json
 * - Index file: ~/CONFIG_DIR/origami/index.json
 */
pub fn build_app_paths(app: &AppHandle) -> AppPaths {
    AppPaths {
        starred_dir: get_starred_dir(app),
        settings_file: get_settings_file(app),
        index_file: get_index_file(app),
    }
}
