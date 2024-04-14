use tauri::AppHandle;
use super::EventEmitter;

#[tauri::command]
pub fn init_emitter(app: AppHandle) -> Result<(), String> {
  let event_emitter = EventEmitter::new(&app);
  event_emitter.start_emitting()
}
