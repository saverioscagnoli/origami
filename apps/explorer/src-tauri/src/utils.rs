use std::path::PathBuf;

pub fn get_starred_dir(app: &tauri::AppHandle) -> PathBuf {
  let path_resolver = app.path_resolver();

  let config_dir = path_resolver.app_config_dir().unwrap();
  let starred_dir = config_dir.join("starred");

  starred_dir
}
