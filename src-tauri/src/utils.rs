use std::sync::{ Arc, Mutex };
use serde::Serialize;
use tauri::{AppHandle, Manager};

use crate::events::{EventFromFrontend, EventToFrontend};

pub fn listen<P>(
  event_pool: Arc<Mutex<Vec<tauri::EventId>>>,
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

  if let Ok(mut event_pool) = event_pool.lock() {
    event_pool.push(id);
  }
}


pub fn emit<P>(app: &AppHandle, evt: EventToFrontend, payload: P) where P: Serialize + Clone {
  let _ = app.emit(EventToFrontend::as_str(&evt), payload);
}