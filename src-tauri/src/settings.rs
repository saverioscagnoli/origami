use std::{ fs, path::Path };

use serde::{ Deserialize, Serialize };
use tauri::{ AppHandle, Manager };

use crate::consts::SETTINGS_FILE_NAME;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
  pub theme: String,
  pub view: String,
  pub show_hidden: bool,
  pub show_checkboxes: bool,
}

impl Default for Settings {
  fn default() -> Self {
    Self {
      theme: "system".to_string(),
      view: "list".to_string(),
      show_hidden: false,
      show_checkboxes: true,
    }
  }
}

impl Settings {
  pub async fn load(path: impl AsRef<Path>) -> Self {
    let path = path.as_ref();

    if !path.exists() {
      let default = Settings::default();
      default.write(path);
    }

    let settings = fs::read_to_string(&path);

    match settings {
      Ok(settings) => {
        match serde_json::from_str(&settings) {
          Ok(settings) => settings,
          Err(_) => Settings::default(),
        }
      }
      Err(_) => Settings::default(),
    }
  }

  pub fn check_validity(&mut self) -> bool {
    let valid_themes = vec!["system", "light", "dark"];
    let valid_views = vec!["list", "grid"];

    let mut valid = true;

    if !valid_themes.contains(&self.theme.as_str()) {
      log::warn!("Invalid theme: {}", self.theme);

      valid = false;
      self.theme = "system".to_string();
    }

    if !valid_views.contains(&self.view.as_str()) {
      log::warn!("Invalid view: {}", self.view);

      valid = false;
      self.view = "list".to_string();
    }

    valid
  }

  pub fn write(&self, path: impl AsRef<Path>) {
    let settings = serde_json::to_string_pretty(&self);

    match settings {
      Ok(settings) => {
        fs::write(&path, settings).unwrap();
      }
      Err(_) => {}
    }
  }
}

#[tauri::command]
pub async fn load_settings(app: AppHandle) -> Settings {
  let path = app.path();
  let settings_file = path.app_config_dir().unwrap().join(SETTINGS_FILE_NAME);

  let mut settings = Settings::load(&settings_file).await;

  let valid = settings.check_validity();

  if !valid {
    settings.write(&settings_file);
  }

  settings
}

#[tauri::command]
pub async fn update_settings(app: AppHandle, key: String, value: String) {
  let path = app.path();
  let settings_file = path.app_config_dir().unwrap().join(SETTINGS_FILE_NAME);

  let mut settings = Settings::load(&settings_file).await;

  match key.as_str() {
    "theme" => {
      settings.theme = value;
    }
    "view" => {
      settings.view = value;
    }
    "showHidden" => {
      settings.show_hidden = value == "true";
    }
    "showCheckboxes" => {
      settings.show_checkboxes = value == "true";
    }
    _ => {}
  }

  settings.check_validity();

  settings.write(&settings_file);
}
