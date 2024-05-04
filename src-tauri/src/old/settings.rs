use std::path::Path;

use serde::{ Deserialize, Serialize };
use tauri::{ AppHandle, Manager };

use crate::consts::SETTINGS_FILE_NAME;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Settings {
  pub theme: String,
  pub view_type: String,
  pub show_hidden: bool,
  pub show_checkboxes: bool,
}

impl Settings {
  pub fn new() -> Self {
    Self {
      theme: "system".to_string(),
      view_type: "list".to_string(),
      show_hidden: false,
      show_checkboxes: false,
    }
  }

  pub async fn load(path: impl AsRef<Path>) -> Self {
    let settings = tokio::fs
      ::read_to_string(path).await
      .unwrap_or_else(|_| { serde_json::to_string_pretty(&Self::new()).unwrap() });

    serde_json::from_str(&settings).unwrap()
  }

  pub async fn check_validity(&mut self) {
    let valid_themes = vec!["system", "light", "dark"];
    let valid_views = vec!["list", "grid"];

    if !valid_themes.contains(&self.theme.as_str()) {
      self.theme = "system".to_string();
    }

    if !valid_views.contains(&self.view_type.as_str()) {
      self.view_type = "list".to_string();
    }
  }

  pub async fn write(&self, path: impl AsRef<Path>) {
    let settings = serde_json::to_string_pretty(&self).unwrap();
    let _ = tokio::fs::write(path, settings).await;
  }
}

#[tauri::command]
pub async fn load_settings(app: AppHandle) -> Settings {
  let path = app.path();
  let settings_file = path.app_config_dir().unwrap().join(SETTINGS_FILE_NAME);

  Settings::load(&settings_file).await
}

#[tauri::command]
pub async fn update_settings(
  app: AppHandle,
  key: String,
  value: String
) -> Result<(), String> {
  let path = app.path();
  let settings_file = path.app_config_dir().unwrap().join(SETTINGS_FILE_NAME);

  let mut settings = Settings::load(&settings_file).await;

  match key.as_str() {
    "theme" => {
      settings.theme = value;
    }
    "viewType" => {
      settings.view_type = value;
    }
    "showHidden" => {
      settings.show_hidden = value.parse().unwrap_or(false);
    }
    "showCheckboxes" => {
      settings.show_checkboxes = value.parse().unwrap_or(false);
    }
    _ => {
      return Err(format!("Invalid key: {}", key));
    }
  }
  settings.write(&settings_file).await;

  Ok(())
}
