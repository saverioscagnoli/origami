use std::{ path::{ self, Path }, thread };

use rand::Rng;
use rayon::iter::{ IntoParallelRefIterator, ParallelIterator };
use tauri::{ AppHandle, Manager, WebviewUrl, WebviewWindowBuilder };
use tokio::task;

use crate::{
  consts::{ COPY_SIZE_THRESHOLD, STARRED_DIR_NAME },
  file_system::{ api::get_read_rate_mbps, structs::CopyProgress },
};

use self::api::{ DirEntry };

pub mod api;
pub mod platform_impl;
pub mod dir;
pub mod file;
pub mod structs;

#[tauri::command]
pub async fn list_dir(app: AppHandle, path: String) -> (Vec<DirEntry>, String) {
  let path_resolver = app.path();
  let starred_dir = path_resolver.app_config_dir().unwrap().join(STARRED_DIR_NAME);

  match api::list_dir(path, starred_dir).await {
    Ok(entries) => (entries, "".to_string()),
    Err(e) => (vec![], e.to_string()),
  }
}

#[tauri::command]
pub async fn open_files(paths: Vec<String>) -> Result<(), String> {
  for path in paths {
    if let Err(e) = api::open_file(path) {
      return Err(e.to_string());
    }
  }

  Ok(())
}

#[tauri::command]
pub async fn rename_entry(path: String, new_name: String) -> (String, String) {
  match api::rename_entry(&path, new_name) {
    Ok(_) => (path, "".to_string()),
    Err(e) => (path, e.to_string()),
  }
}

#[tauri::command]
pub async fn delete_entries(paths: Vec<String>) -> (Vec<String>, Vec<String>) {
  let mut errors = vec![];
  let paths_clone = paths.clone();

  for path in paths {
    match api::delete_entry(&path) {
      Ok(_) => {}
      Err(e) => {
        errors.push(e.to_string());
      }
    }
  }

  (paths_clone, errors)
}

#[tauri::command]
pub async fn create_entry(path: String, is_dir: bool) -> (String, String) {
  match api::create_entry(&path, is_dir) {
    Ok(_) => (path, "".to_string()),
    Err(e) => (path, e.to_string()),
  }
}

#[tauri::command]
pub async fn get_image_base64(path: String) -> (String, String) {
  match api::get_image_base64(path) {
    Ok(base64) => (base64, "".to_string()),
    Err(e) => ("".to_string(), e.to_string()),
  }
}

#[tauri::command]
pub async fn star_entries(
  app: AppHandle,
  paths: Vec<String>
) -> (Vec<String>, Vec<String>) {
  let path_resolver = app.path();
  let starred_dir = path_resolver.app_config_dir().unwrap().join(STARRED_DIR_NAME);

  let mut errors = vec![];

  for path in paths.clone() {
    let path = Path::new(&path);
    let file_name = path.file_name().unwrap();

    let starred_path = starred_dir.join(file_name);

    match platform_impl::create_symlink(path, &starred_path) {
      Ok(_) => {}
      Err(e) => {
        log::info!("Starred path: {:?}", &starred_path);

        errors.push(e.to_string());
      }
    }
  }

  (paths, errors)
}

#[tauri::command]
pub async fn unstar_entries(
  app: AppHandle,
  paths: Vec<String>
) -> (Vec<String>, Vec<String>) {
  let path_resolver = app.path();
  let starred_dir = path_resolver.app_config_dir().unwrap().join(STARRED_DIR_NAME);

  let mut errors = vec![];

  for path in paths.clone() {
    let path = Path::new(&path);
    let file_name = path.file_name().unwrap();

    let starred_path = starred_dir.join(file_name);

    match api::delete_entry(&starred_path) {
      Ok(_) => {}
      Err(e) => {
        errors.push(e.to_string());
      }
    }
  }

  (paths, errors)
}

#[tauri::command]
pub async fn paste_entries(
  app: AppHandle,
  paths: Vec<String>,
  new_dir: String,
  is_cutting: bool
) -> (Vec<String>, Vec<String>) {
  if is_cutting {
    let results: Vec<_> = paths
      .par_iter()
      .map(|path| {
        let path_buf = Path::new(&path);
        let new_dir_buf = Path::new(&new_dir);

        let result = std::fs::rename(
          path,
          new_dir_buf.join(path_buf.file_name().unwrap())
        );
        (path.clone(), result.map_err(|e| e.to_string()))
      })
      .collect();

    let (oks, errs): (Vec<_>, Vec<_>) = results
      .into_iter()
      .partition(|(_, result)| result.is_ok());

    let oks = oks
      .into_iter()
      .map(|(path, _)| path.clone())
      .collect();
    let errs = errs
      .into_iter()
      .map(|(path, _)| path.clone())
      .collect();

    (oks, errs)
  } else {
    let size: u64 = paths
      .par_iter()
      .map(|path| {
        let path = Path::new(&path);

        if path.is_dir() {
          dir::get_size(path)
        } else {
          match path.metadata() {
            Ok(metadata) => metadata.len(),
            Err(_) => 0,
          }
        }
      })
      .sum();

    if size > (COPY_SIZE_THRESHOLD as u64) {
      //let mut errors = vec![];

      WebviewWindowBuilder::new(
        &app,
        "copy".to_string(),
        WebviewUrl::App("copy.html".into())
      )
        .inner_size(400.0, 200.0)
        .build()
        .unwrap();

      let paths_clone = paths.clone();

      let handle = thread::spawn(move || {
        let new_dir = Path::new(&new_dir);

        let start = std::time::Instant::now();
        let options = fs_extra::dir::CopyOptions::default();
        let mut i = 0;

        let _ = fs_extra::copy_items_with_progress(
          &paths,
          new_dir,
          &options,
          |info| {
            if i % 500 == 0 {
              let elapsed = start.elapsed().as_secs_f64();
              let read_rate = get_read_rate_mbps(info.copied_bytes, elapsed).round();

              let payload = CopyProgress {
                total_bytes: info.total_bytes,
                copied_bytes: info.copied_bytes,
                read_rate,
              };

              let _ = app.emit("copy_progress", payload);
            }

            i += 1;

            fs_extra::dir::TransitProcessResult::ContinueOrAbort
          }
        );

        let _ = app.emit("copy_over", start.elapsed().as_secs());
        log::info!("Copy over in {} seconds", start.elapsed().as_secs());
      });

      match handle.join() {
        Ok(_) => {}
        Err(_) => {}
      }

      (paths_clone, vec![])
    } else {
      let results: Vec<_> = paths
        .par_iter()
        .map(|path| {
          let result = api::paste_entry(path, &new_dir, is_cutting);
          (path.clone(), result.map_err(|e| e.to_string()))
        })
        .collect();

      let (oks, errs): (Vec<_>, Vec<_>) = results
        .into_iter()
        .partition(|(_, result)| result.is_ok());

      let oks = oks
        .into_iter()
        .map(|(path, _)| path)
        .collect();
      let errs = errs
        .into_iter()
        .map(|(path, _)| path)
        .collect();

      (oks, errs)
    }
  }
}
