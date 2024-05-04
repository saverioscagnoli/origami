use std::{ path::{ Path, PathBuf }, thread, time::Instant };

use chrono::{ DateTime, Utc };
use fs_extra::dir::{ CopyOptions, TransitProcessResult };
use serde::Serialize;
use tauri::AppHandle;

use crate::{
  consts::{ COPY_SIZE_THRESHOLD, LIST_DIR_BULK_SIZE },
  events::EventToFrontend,
  payloads::{ CopyProgressPayload, DeletePayload, PastePayload, Payload },
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

use std::fs::File;
use std::io::{ self, Read, Write };
use std::time::{ Duration };

pub fn copy_file_with_progress<F>(
  src: impl AsRef<Path>,
  dst: impl AsRef<Path>,
  mut handler: F
) -> io::Result<()>
  where F: FnMut(u64, u64, f64)
{
  let mut src_file = File::open(src.as_ref())?;
  let mut dst_file = File::create(dst.as_ref())?;

  let total_bytes = src_file.metadata()?.len();
  let mut copied_bytes = 0u64;
  let mut buffer = vec![0; 1024 * 1024]; // 1MB buffer
  let start_time = Instant::now();
  let mut rate = 0.0;
  let debounce_interval = Duration::from_millis(200);
  let mut last_call_time = Instant::now();

  while let Ok(n) = src_file.read(&mut buffer) {
    if n == 0 {
      break;
    }
    dst_file.write_all(&buffer[..n])?;
    copied_bytes += n as u64;

    let elapsed_time = start_time.elapsed().as_secs_f64();
    rate = if elapsed_time > 0.0 {
      (copied_bytes as f64) / elapsed_time
    } else {
      0.0
    };

    if last_call_time.elapsed() >= debounce_interval {
      handler(copied_bytes, total_bytes, rate);
      last_call_time = Instant::now();
    }
  }

  // Call the handler one last time to ensure it gets the final state
  if copied_bytes == total_bytes {
    handler(copied_bytes, total_bytes, rate);
  }

  Ok(())
}

#[tauri::command]
pub async fn paste_entries(
  app: AppHandle,
  paths: Vec<String>,
  dir: String,
  is_cutting: bool,
  total_size: u64,
  op_id: String
) -> Result<(), String> {
  let total_paths = paths.len();
  let mut size = 0;

  for path in paths.clone() {
    let path = Path::new(&path);

    if path.is_dir() {
      size += match fs_extra::dir::get_size(&path) {
        Ok(size) => size,
        Err(_) => 0,
      };
    } else {
      size += match tokio::fs::metadata(&path).await {
        Ok(metadata) => metadata.len(),
        Err(_) => 0,
      };
    }
  }

  if !is_cutting && size >= (COPY_SIZE_THRESHOLD as u64) {
    thread::spawn(move || {
      for (index, path) in paths.into_iter().enumerate() {
        let old_path = Path::new(&path);
        let new_path = Path::new(&dir).join(old_path.file_name().unwrap());

        let is_last = index == total_paths - 1;
        let mut i: i32 = 0;

        if old_path.is_dir() {
          if !new_path.exists() {
            fs_extra::dir::create_all(&new_path, false).unwrap();
          }

          fs_extra::dir
            ::copy_with_progress(
              old_path,
              &dir,
              &CopyOptions::default(),
              |info| {
                if i % 5000 == 0 {
                  emit(
                    &app,
                    EventToFrontend::CopyProgress,
                    Payload::<CopyProgressPayload> {
                      op_id: op_id.clone(),
                      error: None,
                      data: Some(CopyProgressPayload {
                        copied: info.copied_bytes,
                        total: info.total_bytes,
                      }),
                      is_finished: is_last,
                    }
                  );

                  println!("{} / {}", info.copied_bytes, info.total_bytes);

                  i = 0;
                }

                i += 1;

                TransitProcessResult::ContinueOrAbort
              }
            )
            .unwrap();
        } else {
          copy_file_with_progress(old_path, new_path, |copied, total, rate| {
            if i % 5000 == 0 {
              emit(
                &app,
                EventToFrontend::CopyProgress,
                Payload::<CopyProgressPayload> {
                  op_id: op_id.clone(),
                  error: None,
                  data: Some(CopyProgressPayload {
                    copied,
                    total,
                  }),
                  is_finished: is_last,
                }
              );

              println!("{} / {} ({} MB/s)", copied, total, rate / 1024.0 / 1024.0);

              i = 0;
            }

            i += 1;
          }).unwrap();
        }
      }

      emit(
        &app,
        EventToFrontend::PasteEntries,
        Payload::<PastePayload> {
          op_id,
          data: Some(PastePayload { dir }),
          error: None,
          is_finished: true,
        }
      );
    });
  } else {
    tokio::spawn(async move {
      for (index, path) in paths.into_iter().enumerate() {
        let old_path = Path::new(&path);
        let new_path = Path::new(&dir).join(old_path.file_name().unwrap());

        if new_path.exists() {
          emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
            op_id: op_id.clone(),
            data: Some(PastePayload { dir: dir.clone() }),
            error: Some(format!("{} already exists", new_path.to_string_lossy())),
            is_finished: false,
          });
        }

        let is_last = index == total_paths - 1;

        if is_cutting {
          match tokio::fs::rename(&path, &new_path).await {
            Ok(_) =>
              emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
                op_id: op_id.clone(),
                data: Some(PastePayload { dir: dir.clone() }),
                error: None,
                is_finished: is_last,
              }),

            Err(e) =>
              emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
                op_id: op_id.clone(),
                data: Some(PastePayload { dir: dir.clone() }),
                error: Some(e.to_string()),
                is_finished: is_last,
              }),
          }
        } else {
          if old_path.is_dir() {
            println!("Copying directory: {:?}", old_path);
            match copy_dir(old_path.into(), new_path).await {
              Ok(_) => {
                emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
                  op_id: op_id.clone(),
                  data: Some(PastePayload { dir: dir.clone() }),
                  error: None,
                  is_finished: is_last,
                });
              }

              Err(e) =>
                emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
                  op_id: op_id.clone(),
                  data: Some(PastePayload { dir: dir.clone() }),
                  error: Some(e.to_string()),
                  is_finished: is_last,
                }),
            }
          } else {
            match tokio::fs::copy(&path, &new_path).await {
              Ok(_) => {
                emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
                  op_id: op_id.clone(),
                  data: Some(PastePayload { dir: dir.clone() }),
                  error: None,
                  is_finished: is_last,
                });
              }

              Err(e) =>
                emit(&app, EventToFrontend::PasteEntries, Payload::<PastePayload> {
                  op_id: op_id.clone(),
                  data: Some(PastePayload { dir: dir.clone() }),
                  error: Some(e.to_string()),
                  is_finished: is_last,
                }),
            }
          }
        }
      }
    });
  }
  Ok(())
}

#[tauri::command]
pub async fn create_entry(
  app: AppHandle,
  path: String,
  is_dir: bool,
  op_id: String
) {
  let result = if is_dir {
    tokio::fs::create_dir_all(&path).await
  } else {
    tokio::fs::File::create(&path).await.map(|_| ())
  };

  match result {
    Ok(_) => {
      emit(&app, EventToFrontend::CreateEntry, Payload::<String> {
        op_id,
        data: Some(path),
        error: None,
        is_finished: true,
      });
    }

    Err(e) => {
      emit(&app, EventToFrontend::CreateEntry, Payload::<String> {
        op_id,
        data: None,
        error: Some(e.to_string()),
        is_finished: true,
      });
    }
  }
}

#[tauri::command]
pub async fn rename_entry(
  app: AppHandle,
  old_path: String,
  new_name: String,
  op_id: String
) {
  let new_path_buf = Path::new(&old_path).with_file_name(new_name);

  match tokio::fs::rename(&old_path, &new_path_buf).await {
    Ok(_) => {
      emit(&app, EventToFrontend::RenameEntry, Payload::<String> {
        op_id,
        data: Some(new_path_buf.to_string_lossy().to_string()),
        error: None,
        is_finished: true,
      });
    }

    Err(e) => {
      emit(&app, EventToFrontend::RenameEntry, Payload::<String> {
        op_id,
        data: None,
        error: Some(e.to_string()),
        is_finished: true,
      });
    }
  }
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
        emit(&app, EventToFrontend::DeleteEntries, Payload::<DeletePayload> {
          op_id: op_id.clone(),
          data: Some(DeletePayload {
            dir: path_buf.parent().unwrap().to_string_lossy().to_string(),
          }),
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
