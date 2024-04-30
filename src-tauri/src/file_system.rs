use std::path::{ Path, PathBuf };

use chrono::{ DateTime, Utc };
use serde::Serialize;
use tauri::AppHandle;

use crate::{
  consts::LIST_DIR_BULK_SIZE,
  events::EventToFrontend,
  payloads::Payload,
  structs::DirEntry,
  utils::emit,
};

#[derive(Serialize)]
struct Data {
  entries: Vec<DirEntry>,
  path: String,
}

#[tauri::command]
pub async fn list_dir(
  app: AppHandle,
  path: String,
  op_id: String
) -> Result<(), ()> {
  let mut entries = Vec::new();

  let dir = tokio::fs::read_dir(&path).await;

  println!("{:?}", path);

  if dir.is_err() {
    emit(&app, EventToFrontend::ListDir, Payload::<()> {
      op_id,
      data: None,
      error: Some(dir.err().unwrap().to_string()),
      is_finished: true,
    });
    return Err(());
  }

  let mut dir: tokio::fs::ReadDir = dir.unwrap();

  while
    // prettier-ignore
    let Some(entry) = match dir.next_entry().await {
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
    }
  {
    let path = entry.path();
    let name = entry.file_name();
    let is_dir = path.is_dir();
    let is_hidden = is_hidden(&path).unwrap_or(false);
    let is_symlink = is_symlink(&path).await.unwrap_or(false);
    let is_starred = false;
    let last_modified = last_modified(&path).await.unwrap_or("Unknown".to_string());

    let size = if is_dir {
      0
    } else {
      match tokio::fs::metadata(&path).await {
        Ok(metadata) => metadata.len(),
        Err(_) => 0,
      }
    };

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

    if entries.len() % LIST_DIR_BULK_SIZE == 0 {
      emit(
        &app,
        EventToFrontend::ListDir,
        &(Payload::<Data> {
          op_id: op_id.clone(),
          data: Some(Data {
            entries: entries.clone(),
            path: "Changing...".to_string(),
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
    &(Payload::<Data> {
      op_id,
      data: Some(Data { entries, path }),
      error: None,
      is_finished: true,
    })
  );

  Ok(())
}

fn is_hidden(path: impl AsRef<Path>) -> Option<bool> {
  let path = path.as_ref();

  #[cfg(target_os = "windows")]
  {
    use std::os::windows::fs::MetadataExt;

    const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;

    let metadata = match path.metadata() {
      Ok(metadata) => metadata,
      Err(_) => {
        return None;
      }
    };

    let is_hidden = (metadata.file_attributes() & FILE_ATTRIBUTE_HIDDEN) != 0;

    Some(is_hidden)
  }

  #[cfg(not(target_os = "windows"))]
  {
    let name = match path.file_name() {
      Some(name) => name,
      None => {
        return None;
      }
    };

    Some(name.to_string_lossy().starts_with('.'))
  }
}

async fn is_symlink(path: impl AsRef<Path>) -> Option<bool> {
  let path = path.as_ref();

  let metadata = match tokio::fs::symlink_metadata(&path).await {
    Ok(metadata) => metadata,
    Err(_) => {
      return None;
    }
  };

  Some(metadata.file_type().is_symlink())
}

async fn last_modified(path: impl AsRef<Path>) -> Result<String, tokio::io::Error> {
  let path = path.as_ref();

  let time = tokio::fs::metadata(&path).await?.modified()?;
  let date: String = DateTime::<Utc>
    ::from(time)
    .format("%d/%m/%Y %H:%M")
    .to_string();

  Ok(date)
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
/* Copy a directory recursively. */
async fn copy_dir(from: PathBuf, to: PathBuf) -> Result<(), tokio::io::Error> {
  tokio::fs::create_dir_all(&to).await?;

  let mut entries = tokio::fs::read_dir(&from).await?;

  while let Some(entry) = entries.next_entry().await? {
    let path = entry.path();
    let new_path = to.join(entry.file_name());

    if path.is_dir() {
      // Box the recursive call to copy_dir
      let task = Box::pin(copy_dir(path, new_path));
      task.await?;
    } else {
      tokio::fs::copy(&path, &new_path).await?;
    }
  }

  Ok(())
}

#[tauri::command]
pub async fn paste_entries(
  app: AppHandle,
  paths: Vec<String>,
  dir: String,
  is_cutting: bool,
  op_id: String
) -> Result<(), String> {
  let total_paths = paths.len();
  let dir_clone = dir.clone();

  for (index, path) in paths.into_iter().enumerate() {
    let old_path = Path::new(&path);
    let new_path = Path::new(&dir).join(old_path.file_name().unwrap());

    if new_path.exists() {
      emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
        op_id: op_id.clone(),
        data: Some(dir_clone.clone()),
        error: Some(format!("{} already exists", new_path.to_string_lossy())),
        is_finished: false,
      });
    }

    let is_last = index == total_paths - 1;

    if is_cutting {
      match tokio::fs::rename(&path, &new_path).await {
        Ok(_) =>
          emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
            op_id: op_id.clone(),
            data: Some(dir_clone.clone()),
            error: None,
            is_finished: is_last,
          }),

        Err(e) =>
          emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
            op_id: op_id.clone(),
            data: None,
            error: Some(e.to_string()),
            is_finished: is_last,
          }),
      }
    } else {
      if old_path.is_dir() {
        match copy_dir(old_path.into(), new_path).await {
          Ok(_) => {
            emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
              op_id: op_id.clone(),
              data: Some(dir_clone.clone()),
              error: None,
              is_finished: is_last,
            });
          }

          Err(e) =>
            emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
              op_id: op_id.clone(),
              data: None,
              error: Some(e.to_string()),
              is_finished: is_last,
            }),
        }
      } else {
        match tokio::fs::copy(&path, &new_path).await {
          Ok(_) => {
            emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
              op_id: op_id.clone(),
              data: Some(dir_clone.clone()),
              error: None,
              is_finished: is_last,
            });
          }

          Err(e) =>
            emit(&app, EventToFrontend::PasteEntries, Payload::<String> {
              op_id: op_id.clone(),
              data: None,
              error: Some(e.to_string()),
              is_finished: is_last,
            }),
        }
      }
    }
  }

  Ok(())
}

#[tauri::command]
pub async fn delete_entries(
  app: AppHandle,
  paths: Vec<String>,
  op_id: String
) -> Result<(), String> {
  let len = paths.len();

  for (i, path) in paths.into_iter().enumerate() {
    let path_buf = Path::new(&path);

    let result = if path_buf.is_dir() {
      tokio::fs::remove_dir_all(&path).await
    } else {
      tokio::fs::remove_file(&path).await
    };

    let is_last = i == len - 1;

    match result {
      Ok(_) =>
        emit(&app, EventToFrontend::DeleteEntries, Payload::<String> {
          op_id: op_id.clone(),
          data: Some(path_buf.parent().unwrap().to_string_lossy().to_string()),
          error: None,
          is_finished: is_last,
        }),

      Err(e) =>
        emit(&app, EventToFrontend::DeleteEntries, Payload::<()> {
          op_id: op_id.clone(),
          data: None,
          error: Some(e.to_string()),
          is_finished: is_last,
        }),
    }
  }

  Ok(())
}
