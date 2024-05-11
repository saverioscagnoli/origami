use super::{dir, file, misc, platform_impl};
use crate::{
    app_windows::spawn_copy_window,
    consts::{COPY_SIZE_THRESHOLD, STARRED_DIR_NAME},
    enums::{BackendEvent, Command},
    file_system,
};
use rayon::iter::{IntoParallelRefIterator, ParallelIterator};
use std::{path::Path, thread, time::Instant};
use tauri::{AppHandle, Manager};

#[tauri::command]
pub async fn list_dir(app: AppHandle, dir: String, id: u64, label: String) {
    tokio::spawn(async move {
        let path = app.path();
        let app_config_dir = path.app_config_dir().unwrap();

        let entries = dir::list_dir(&dir, app_config_dir).await;

        match entries {
            Ok(entries) => {
                Command::ListDir(id, Some((dir.clone(), entries)), None, true).emit(&app, label);
                log::info!("Listed directory: {:?}", dir);
            }

            Err(err) => {
                Command::ListDir(id, None, Some(err.to_string()), true).emit(&app, label);
                log::error!("Failed to list directory: {:?}", dir);
            }
        }
    });
}

#[tauri::command]
pub async fn create_entry(app: AppHandle, path: String, is_dir: bool, id: u64, label: String) {
    tokio::spawn(async move {
        let res = if is_dir {
            dir::create_dir(&path).await
        } else {
            file::create_file(&path).await
        };

        match res {
            Ok(_) => {
                let path_resolver = app.path();

                let starred_dir = path_resolver
                    .app_config_dir()
                    .unwrap()
                    .join(STARRED_DIR_NAME);

                let entry = super::into_entry(&path, starred_dir);

                if entry.is_none() {
                    Command::CreateEntry(
                        id,
                        None,
                        Some("Failed to create entry".to_string()),
                        true,
                    )
                    .emit(&app, label);

                    log::error!("Failed to create entry: {:?}", path);
                    return;
                }

                let entry = entry.unwrap();

                Command::CreateEntry(id, Some(entry), None, true).emit(&app, label);
                log::info!("Created entry: {:?}", path);
            }

            Err(err) => {
                Command::CreateEntry(id, None, Some(err.to_string()), true).emit(&app, label);
                log::error!("Failed to create entry: {:?}", path);
            }
        }
    });
}

#[tauri::command]
pub async fn delete_entries(app: AppHandle, paths: Vec<String>, id: u64, label: String) {
    let label_clone = label.clone();

    let path_resolver = app.path();
    let starred_dir = path_resolver
        .app_config_dir()
        .unwrap()
        .join(STARRED_DIR_NAME);

    tokio::spawn(async move {
        for (i, path) in paths.iter().enumerate() {
            let path_buf = Path::new(&path);
            let path_clone = path.clone();

            let is_last = i == paths.len() - 1;

            let res = if path_buf.is_dir() {
                dir::delete_dir(&path).await
            } else {
                file::delete_file(&path).await
            };

            let starred_path = starred_dir.join(path_buf.file_name().unwrap());

            if starred_path.exists() {
                if starred_path.is_dir() {
                    let _ = dir::delete_dir(&starred_path).await;
                } else {
                    let _ = file::delete_file(&starred_path).await;
                }
            }

            match res {
                Ok(_) => {
                    Command::DeleteEntries(id, Some(path.to_string()), None, is_last)
                        .emit(&app, label_clone.clone());
                    log::info!("Deleted entry: {:?}", path_clone);
                }

                Err(err) => {
                    Command::DeleteEntries(id, None, Some(err.to_string()), is_last)
                        .emit(&app, label_clone.clone());
                    log::error!("Failed to delete entry: {:?}", path);
                }
            }
        }
    });
}

#[tauri::command]
pub async fn rename_entry(
    app: AppHandle,
    old_path: String,
    new_name: String,
    id: u64,
    label: String,
) {
    let path_resolver = app.path();
    let starred_dir = path_resolver
        .app_config_dir()
        .unwrap()
        .join(STARRED_DIR_NAME);

    tokio::spawn(async move {
        let old_path_buf = Path::new(&old_path);
        let new_path = old_path_buf.with_file_name(&new_name);

        let res = misc::rename_entry(&old_path, &new_path).await;

        match res {
            Ok(_) => {
                let entry = file_system::into_entry(&new_path, &starred_dir).unwrap();
                Command::RenameEntry(id, Some((old_path.clone(), entry)), None, true)
                    .emit(&app, label);

                log::info!("Renamed entry: {:?} to {:?}", old_path, new_path);
            }

            Err(err) => {
                Command::RenameEntry(id, None, Some(err.to_string()), true).emit(&app, label);
                log::error!(
                    "Failed to rename entry: {:?} to {:?} - {:?}",
                    old_path,
                    new_path,
                    err
                );
            }
        }
    });
}

#[tauri::command]
pub async fn open_files(app: AppHandle, paths: Vec<String>, id: u64, label: String) {
    let label_clone = label.clone();

    tokio::spawn(async move {
        for (i, path) in paths.iter().enumerate() {
            let is_last = i == paths.len() - 1;

            let res = platform_impl::open_file(&path);

            match res {
                Ok(_) => {
                    Command::OpenFiles(id, Some(path.to_string()), None, is_last)
                        .emit(&app, label_clone.clone());
                    log::info!("Opened file: {:?}", path);
                }

                Err(err) => {
                    Command::OpenFiles(id, None, Some(err.to_string()), is_last)
                        .emit(&app, label_clone.clone());
                    log::error!("Failed to open file: {:?}", path);
                }
            }
        }
    });
}

#[tauri::command]
pub async fn paste_entries(
    app: AppHandle,
    paths: Vec<String>,
    dest: String,
    cut: bool,
    id: u64,
    label: String,
) {
    let paths_clone = paths.clone();
    let path_resolver = app.path();
    let starred_dir = path_resolver
        .app_config_dir()
        .unwrap()
        .join(STARRED_DIR_NAME);

    let label_clone = label.clone();

    let size_handle = tokio::spawn(async move {
        let size: u64 = paths_clone
            .par_iter()
            .map(|path| {
                let path = Path::new(&path);

                if path.is_dir() {
                    dir::get_size(&path)
                } else {
                    match path.metadata() {
                        Ok(metadata) => metadata.len(),
                        Err(_) => 0,
                    }
                }
            })
            .sum();

        size
    });

    let size = size_handle.await.unwrap();

    if !cut && size > COPY_SIZE_THRESHOLD {
        let copy = spawn_copy_window(&app).await;

        thread::spawn(move || {
            let start = Instant::now();

            let _ = file_system::copy_items_with_progress(
                paths,
                dest,
                starred_dir,
                |total, copied| {
                    BackendEvent::CopyProgress(total, copied)
                        .emit_to(&app, copy.label().to_string());
                },
                |entry, is_last| {
                    Command::PasteEntries(id, Some(entry), None, is_last)
                        .emit(&app, label_clone.clone());
                },
            );

            let duration = start.elapsed();

            BackendEvent::CopyOver(duration.as_secs()).emit_to(&app, copy.label().to_string());
        });
    } else {
        tokio::spawn(async move {
            for (i, path) in paths.iter().enumerate() {
                let is_last = i == paths.len() - 1;
                let from = Path::new(&path);
                let mut to = Path::new(&dest).join(from.file_name().unwrap());

                let mut counter = 1;

                while to.exists() {
                    let mut new_name = to.file_stem().unwrap().to_os_string();
                    new_name.push(format!(" ({})", counter));
                    if let Some(extension) = to.extension() {
                        new_name.push(".");
                        new_name.push(extension);
                    }
                    to.set_file_name(new_name);
                    counter += 1;
                }

                let res = if from.is_dir() {
                    if cut {
                        misc::rename_entry(&from, &to).await
                    } else {
                        dir::copy_dir(&from, &to).await
                    }
                } else {
                    if cut {
                        misc::rename_entry(&from, &to).await
                    } else {
                        file::copy_file(&from, &to).await
                    }
                };

                match res {
                    Ok(_) => {
                        let entry = file_system::into_entry(&to, &starred_dir).unwrap();
                        Command::PasteEntries(id, Some(entry), None, is_last)
                            .emit(&app, label.clone());

                        log::info!("Pasted entry: {:?} to {:?}", path, dest);
                    }

                    Err(err) => {
                        Command::PasteEntries(id, None, Some(err.to_string()), is_last)
                            .emit(&app, label_clone.clone());
                        log::error!(
                            "Failed to paste entry: {:?} to {:?} - {:?}",
                            path,
                            dest,
                            err
                        );
                    }
                }
            }
        });
    }
}

#[tauri::command]
pub async fn star_entries(app: AppHandle, paths: Vec<String>, id: u64, label: String) {
    let path_resolver = app.path();
    let starred_dir = path_resolver
        .app_config_dir()
        .unwrap()
        .join(STARRED_DIR_NAME);

    let label_clone = label.clone();

    tokio::spawn(async move {
        for (i, path) in paths.iter().enumerate() {
            let path = Path::new(&path);
            let file_name = path.file_name().unwrap();

            let is_last = i == paths.len() - 1;

            let starred_path = starred_dir.join(file_name);

            match platform_impl::create_symlink(&path, &starred_path) {
                Ok(_) => {
                    let entry = file_system::into_entry(&path, &starred_dir).unwrap();

                    Command::StarEntries(id, Some(entry), None, is_last)
                        .emit(&app, label_clone.clone());
                    log::info!("Starred entry: {:?}", path);
                }

                Err(err) => {
                    Command::StarEntries(id, None, Some(err.to_string()), is_last)
                        .emit(&app, label_clone.clone());
                    log::error!("Failed to star entry: {:?} - {:?}", path, err);
                }
            }
        }
    });
}

#[tauri::command]
pub async fn unstar_entries(app: AppHandle, paths: Vec<String>, id: u64, label: String) {
    let path_resolver = app.path();
    let starred_dir = path_resolver
        .app_config_dir()
        .unwrap()
        .join(STARRED_DIR_NAME);

    let label_clone = label.clone();

    tokio::spawn(async move {
        for (i, path) in paths.iter().enumerate() {
            let path = Path::new(&path);
            let file_name = path.file_name().unwrap();

            let is_last = i == paths.len() - 1;

            let starred_path = starred_dir.join(file_name);

            let res = if starred_path.is_dir() {
                dir::delete_dir(&starred_path).await
            } else {
                file::delete_file(&starred_path).await
            };

            match res {
                Ok(_) => {
                    Command::UnstarEntries(
                        id,
                        Some(file_system::into_entry(&path, &starred_dir).unwrap()),
                        None,
                        is_last,
                    )
                    .emit(&app, label_clone.clone());
                    log::info!("Unstarred entry: {:?}", path);
                }

                Err(err) => {
                    Command::UnstarEntries(id, None, Some(err.to_string()), is_last)
                        .emit(&app, label_clone.clone());
                    log::error!("Failed to unstar entry: {:?} - {:?}", path, err);
                }
            }
        }
    });
}

#[tauri::command]
pub async fn get_image_base64(path: String) -> Result<String, ()> {
    let image = std::fs::read(&path).map_err(|_| ())?;

    let base64 = misc::image_to_base64(image).await;

    Ok(base64)
}
