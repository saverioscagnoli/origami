use super::{dir, file, misc, platform_impl};
use crate::{
    app_windows::spawn_copy_window,
    consts::{COPY_SIZE_THRESHOLD, STARRED_DIR_NAME},
    enums::{BackendEvent, Command},
    file_system,
    utils::AppPaths,
};
use rayon::iter::{ParallelBridge, ParallelIterator};
use std::{path::Path, thread};
use tauri::{AppHandle, Manager, WebviewWindow};

#[tauri::command]
pub async fn list_dir(app: AppHandle, dir: String, id: u64, label: String) -> Result<(), ()> {
    tokio::spawn(async move {
        let app_paths = app.state::<AppPaths>();
        let starred_dir = &app_paths.starred_dir;

        let entries = dir::list_dir(&dir, starred_dir, |entries| {
            Command::ListDir(id, Some((dir.clone(), entries)), None, false)
                .emit(&app, label.clone());
        });

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

    Ok(())
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
                let app_paths = app.state::<AppPaths>();
                let starred_dir = &app_paths.starred_dir;

                let entry = super::into_entry(&path, Some(starred_dir));

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
    tokio::spawn(async move {
        let app_paths = app.state::<AppPaths>();
        let starred_dir = &app_paths.starred_dir;

        let old_path_buf = Path::new(&old_path);
        let new_path = old_path_buf.with_file_name(&new_name);

        let res = misc::rename_entry(&old_path, &new_path).await;

        match res {
            Ok(_) => {
                let entry = file_system::into_entry(&new_path, Some(starred_dir)).unwrap();
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
    tokio::spawn(async move {
        let app_paths = app.state::<AppPaths>();
        let starred_dir = &app_paths.starred_dir;

        // If cutting, rename the entries.
        if cut {
            for (i, path) in paths.iter().enumerate() {
                let is_finished = i == paths.len() - 1;

                let dest = Path::new(&dest);
                let file_name = Path::new(&path).file_name().unwrap();
                let new_path = dest.join(file_name);

                let res = misc::rename_entry(&path, &new_path).await;

                match res {
                    Ok(_) => {
                        let entry = file_system::into_entry(&new_path, Some(starred_dir)).unwrap();
                        Command::PasteEntries(id, Some(entry), None, is_finished)
                            .emit(&app, label.clone());
                        log::info!("Pasted entry: {:?}", path);
                    }

                    Err(err) => {
                        Command::PasteEntries(id, None, Some(err.to_string()), is_finished)
                            .emit(&app, label.clone());
                        log::error!("Failed to paste entry: {:?} - {:?}", path, err);
                    }
                }
            }
        } else {
            // Get the total size of the entries.
            let size: u64 = paths
                .iter()
                .par_bridge()
                .map(|path| {
                    let path = Path::new(&path);

                    if path.is_dir() {
                        dir::get_size(&path)
                    } else {
                        file::get_size(&path.metadata().unwrap())
                    }
                })
                .sum();

            if size >= COPY_SIZE_THRESHOLD {
                let win = spawn_copy_window(&app).await;

                thread::spawn(move || {
                    paste_heavy(&app, paths, dest, id, label, win);
                });
            } else {
                for (i, path) in paths.iter().enumerate() {
                    let path = Path::new(&path);
                    let dest = Path::new(&dest).join(path.file_name().unwrap());

                    let res = {
                        if path.is_dir() {
                            dir::copy_dir(&path, &dest).await
                        } else {
                            file::copy_file(&path, &dest).await
                        }
                    };

                    match res {
                        Ok(_) => {
                            let entry = file_system::into_entry(&dest, Some(starred_dir)).unwrap();
                            Command::PasteEntries(id, Some(entry), None, i == paths.len() - 1)
                                .emit(&app, label.clone());
                        }
                        Err(err) => {
                            Command::PasteEntries(
                                id,
                                None,
                                Some(err.to_string()),
                                i == paths.len() - 1,
                            )
                            .emit(&app, label.clone());
                        }
                    }
                }
            }
        }
    });
}

// If the size of the entries is greater than the threshold, spawn a new window to copy the entries.
pub fn paste_heavy(
    app: &AppHandle,
    paths: Vec<String>,
    dest: String,
    id: u64,
    label: String,
    win: WebviewWindow,
) {
    let app_paths = app.state::<AppPaths>();
    let starred_dir = &app_paths.starred_dir;

    let callback = |total, copied| {
        BackendEvent::CopyProgress(total, copied).emit_to(app, win.label().to_string());
    };

    let on_entry_copied = |entry, is_finished| {
        Command::PasteEntries(id, Some(entry), None, is_finished).emit(&app, label.clone());
    };

    _ = file_system::copy_items_with_progress(paths, dest, starred_dir, callback, on_entry_copied);

    _ = win.close();
}

#[tauri::command]
pub async fn star_entries(app: AppHandle, paths: Vec<String>, id: u64, label: String) {
    let label_clone = label.clone();

    tokio::spawn(async move {
        let app_paths = app.state::<AppPaths>();
        let starred_dir = &app_paths.starred_dir;

        for (i, path) in paths.iter().enumerate() {
            let path = Path::new(&path);
            let file_name = path.file_name().unwrap();

            let is_last = i == paths.len() - 1;

            let starred_path = starred_dir.join(file_name);

            match platform_impl::create_symlink(&path, &starred_path) {
                Ok(_) => {
                    let entry = file_system::into_entry(&path, Some(starred_dir)).unwrap();

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
    let label_clone = label.clone();

    tokio::spawn(async move {
        let app_paths = app.state::<AppPaths>();
        let starred_dir = &app_paths.starred_dir;

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
                        Some(file_system::into_entry(&path, Some(&starred_dir)).unwrap()),
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
