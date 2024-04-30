use std::sync::{ Arc, Mutex };
use serde::Serialize;
use tauri::{ AppHandle, Manager };

use crate::events::{ EventFromFrontend, EventToFrontend };

pub fn listen<P>(
  app: &AppHandle,
  event: EventFromFrontend,
  cb: impl Fn(P) + Send + 'static
)
  where P: serde::de::DeserializeOwned
{
  let id = app.listen(EventFromFrontend::as_str(&event), move |evt| {
    let payload: Result<P, _> = serde_json::from_str(evt.payload());
    match payload {
      Ok(val) => cb(val),
      Err(_) => log::error!("failed to deserialize payload"),
    }
  });
}

pub fn emit<P>(app: &AppHandle, evt: EventToFrontend, payload: P)
  where P: Serialize + Clone
{
  let _ = app.emit(EventToFrontend::as_str(&evt), payload);
}

#[tauri::command]
pub fn get_os() -> String {
  #[cfg(target_os = "windows")]
  return "windows".to_string();

  #[cfg(target_os = "macos")]
  return "macos".to_string();

  #[cfg(target_os = "linux")]
  return "linux".to_string();
}
