use rayon::iter::{
  IndexedParallelIterator,
  IntoParallelRefIterator,
  ParallelIterator,
};
use tauri::AppHandle;

use crate::{
  consts::LIST_DIR_BULK_SIZE,
  events::EventToFrontend,
  payloads::{ ListDirPayload, Payload },
  utils::emit,
};

pub mod api;
pub mod platform_impl;

#[tauri::command]
pub fn list_dir(app: AppHandle, path: String, op_id: String) {
  let path_clone = path.clone();

  tokio::spawn(async move {
    let mut dir = tokio::fs::read_dir(&path).await.unwrap();
    let mut entries = Vec::new();

    while let Ok(entry) = dir.next_entry().await {
      if entry.is_none() {
        continue;
      }

      let entry = entry.unwrap();

      let path = entry.path();
      let name = entry.file_name();
      let is_dir = path.is_dir();
      let is_hidden = platform_impl::is_hidden(&path);
      let is_symlink = api::is_symlink(&path);
      let is_starred = false;
      let last_modified = api::last_modified(&path);

      let size = if is_dir {
        0
      } else {
        entry
          .metadata().await
          .map(|metadata| metadata.len())
          .unwrap_or(0)
      };

      let entry = crate::structs::DirEntry {
        path: path.to_string_lossy().to_string(),
        name: name.to_string_lossy().to_string(),
        is_dir,
        is_hidden,
        is_symlink,
        is_starred,
        last_modified,
        size,
      };

      if entries.len() % LIST_DIR_BULK_SIZE == 0 {
        emit(
          &app,
          EventToFrontend::ListDir,
          &(Payload::<ListDirPayload> {
            op_id: op_id.clone(),
            data: Some(ListDirPayload {
              path: path_clone.clone(),
              entries: entries.clone(),
            }),
            error: None,
            is_finished: false,
          })
        );
      }

      entries.push(entry);
    }

    emit(
      &app,
      EventToFrontend::ListDir,
      &(Payload::<ListDirPayload> {
        op_id,
        data: Some(ListDirPayload {
          path: path_clone,
          entries,
        }),
        error: None,
        is_finished: true,
      })
    );
  });
}

#[tauri::command]
pub fn open_file(app: AppHandle, path: String, op_id: String) {
  let result = api::open_file(&path);

  if let Err(e) = result {
    emit(
      &app,
      EventToFrontend::OpenFile,
      &(Payload::<String> {
        op_id,
        data: None,
        error: Some(e.to_string()),
        is_finished: true,
      })
    );

    log::error!("failed to open file: {:?}", e);
  } else {
    emit(
      &app,
      EventToFrontend::OpenFile,
      &(Payload::<String> {
        op_id,
        data: Some(path),
        error: None,
        is_finished: true,
      })
    );
  }
}

#[tauri::command]
pub fn paste_entries(
  app: AppHandle,
  paths: Vec<String>,
  dir: String,
  op_id: String
) {
  let dir_clone = dir.clone();

  api::paste_entries(paths, dir, |result| {
    if let Err(e) = result {
      emit(
        &app,
        EventToFrontend::PasteEntries,
        &(Payload::<String> {
          op_id: op_id.clone(),
          data: None,
          error: Some(e.to_string()),
          is_finished: false,
        })
      );

      log::error!("failed to paste entries: {:?}", e);
    } else {
      emit(
        &app,
        EventToFrontend::PasteEntries,
        &(Payload::<String> {
          op_id: op_id.clone(),
          data: Some(dir_clone.clone()),
          error: None,
          is_finished: false,
        })
      );
    }
  });

  emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
    op_id,
    data: Some(dir_clone),
    error: None,
    is_finished: true,
  })
}

#[tauri::command]
pub fn create_entry(app: AppHandle, path: String, op_id: String) {
  match api::create_entry(&path) {
    Ok(_) => {
      emit(
        &app,
        EventToFrontend::CreateEntry,
        &(Payload::<String> {
          op_id,
          data: Some(path),
          error: None,
          is_finished: true,
        })
      );
    }
    Err(e) => {
      emit(
        &app,
        EventToFrontend::CreateEntry,
        &(Payload::<String> {
          op_id,
          data: None,
          error: Some(e.to_string()),
          is_finished: true,
        })
      );

      log::error!("failed to create entry: {:?}", e);
    }
  }
}

#[tauri::command]
pub fn rename_entry(
  app: AppHandle,
  old_path: String,
  new_name: String,
  op_id: String
) {
  match api::rename_entry(&old_path, &new_name) {
    Ok(_) => {
      emit(
        &app,
        EventToFrontend::RenameEntry,
        &(Payload::<String> {
          op_id,
          data: Some(old_path.clone()),
          error: None,
          is_finished: true,
        })
      );
    }
    Err(e) => {
      emit(
        &app,
        EventToFrontend::RenameEntry,
        &(Payload::<String> {
          op_id,
          data: None,
          error: Some(e.to_string()),
          is_finished: true,
        })
      );

      log::error!("failed to rename entry: {:?}", e);
    }
  }
}

#[tauri::command]
pub fn delete_entries(app: AppHandle, paths: Vec<String>, op_id: String) {
  let paths_clone = paths.clone();

  api::delete_entries(paths, |result| {
    // paths is moved here
    if let Err(e) = result {
      emit(
        &app,
        EventToFrontend::DeleteEntries,
        &(Payload::<String> {
          op_id: op_id.clone(),
          data: None,
          error: Some(e.to_string()),
          is_finished: false,
        })
      );

      log::error!("failed to delete entries: {:?}", e);
    } else {
      emit(
        &app,
        EventToFrontend::DeleteEntries,
        &(Payload::<String> {
          op_id: op_id.clone(),
          data: Some(paths_clone.join(", ")),
          error: None,
          is_finished: false,
        })
      );
    }
  });

  emit(&app, EventToFrontend::DeleteEntries, Payload::<String> {
    op_id,
    data: Some(paths_clone.join(", ")),
    error: None,
    is_finished: true,
  })
}
