use serde::Serialize;
use tauri::{ AppHandle, Event, Manager };

use crate::enums::{ EventFromFrontend, EventToFrontend };

pub fn emit<P>(
  app: &AppHandle,
  evt: EventToFrontend,
  payload: P
) -> Result<(), String>
  where P: Serialize + Clone
{
  match app.emit(EventToFrontend::as_str(&evt), payload) {
    Ok(_) => Ok(()),
    Err(e) => Err(e.to_string()),
  }
}

pub fn once<F>(app: &AppHandle, evt: EventFromFrontend, handler: F)
  where F: FnOnce(Event) + Send + 'static
{
  app.once(EventFromFrontend::as_str(&evt), handler);
}

pub fn listen<F>(app: &AppHandle, evt: EventFromFrontend, handler: F)
  where F: Fn(Event) + Send + 'static
{
  app.listen(EventFromFrontend::as_str(&evt), handler);
}
