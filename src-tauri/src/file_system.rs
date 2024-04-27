use serde::Serialize;
use tauri::AppHandle;

use crate::{
  consts::LIST_DIR_BULK_SIZE,
  events::EventToFrontend,
  payloads::Payload,
  structs::DirEntry,
  utils::emit,
};

#[tauri::command]
pub async fn list_dir(
  app: AppHandle,
  path: String,
  op_id: String
) -> Result<(), ()> {
  let mut entries = Vec::new();

  let dir = tokio::fs::read_dir(&path).await;

  if dir.is_err() {
    emit(&app, EventToFrontend::ListDir, Payload::<()> {
      op_id,
      data: None,
      error: Some(dir.err().unwrap().to_string()),
      is_finished: true,
    });
    return Err(());
  }

  let mut dir = dir.unwrap();
  let mut i = 0;

  while
    let Some(entry) = (match dir.next_entry().await {
      Ok(entry) => entry,
      Err(e) => {
        emit(&app, EventToFrontend::ListDir, Payload::<()> {
          op_id,
          data: None,
          error: Some(e.to_string()),
          is_finished: true,
        });
        return Ok(());
      }
    })
  {
    let path = entry.path();
    let name = entry.file_name();
    let is_dir = path.is_dir();
    let is_hidden = name.to_string_lossy().starts_with(".");
    let is_symlink = path.symlink_metadata().unwrap().file_type().is_symlink();
    let is_starred = false;
    let last_modified = path
      .metadata()
      .unwrap()
      .modified()
      .unwrap()
      .elapsed()
      .unwrap()
      .as_secs()
      .to_string();
    let size = if is_dir { 0 } else { path.metadata().unwrap().len() };

    let entry = DirEntry {
      path: path.to_string_lossy().to_string(),
      name: name.to_string_lossy().to_string(),
      is_dir,
      is_hidden,
      is_symlink,
      is_starred,
      last_modified,
      size,
    };

    i += 1;

    if i % LIST_DIR_BULK_SIZE == 0 {
      emit(
        &app,
        EventToFrontend::ListDir,
        &(Payload::<Vec<DirEntry>> {
          op_id: op_id.clone(),
          data: Some(entries.clone()),
          error: None,
          is_finished: false,
        })
      );

      println!("emitted: {:?}", i);

      entries.clear();
    }

    entries.push(entry);
  }

  #[derive(Serialize)]
  struct Data {
    entries: Vec<DirEntry>,
    path: String,
  }

  emit(
    &app,
    EventToFrontend::ListDir,
    &(Payload::<Data> {
      op_id,
      data: Some(Data { entries, path }),
      error: None,
      is_finished: true,
    })
  );

  Ok(())
}

#[tauri::command]
pub fn open_file(app: AppHandle, path: String, op_id: String) {
  match open::that(&path) {
    Ok(_) =>
      emit(&app, EventToFrontend::OpenFile, Payload::<String> {
        op_id,
        data: Some(path),
        error: None,
        is_finished: true,
      }),

    Err(e) =>
      emit(&app, EventToFrontend::OpenFile, Payload::<String> {
        op_id,
        data: None,
        error: Some(e.to_string()),
        is_finished: true,
      }),
  }
}
