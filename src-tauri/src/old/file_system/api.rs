use std::{ io, path::Path };

use chrono::{ DateTime, Utc };
use fs_extra::dir::CopyOptions;
use rayon::iter::{ IntoParallelRefIterator, ParallelIterator };
use tauri::AppHandle;

use super::platform_impl::is_hidden;

use crate::structs::DirEntry;

pub fn list_dir<F>(
  path: impl AsRef<Path>,
  mut callback: F
) -> io::Result<Vec<DirEntry>>
  where F: FnMut(&Vec<DirEntry>) + Sync + Send
{
  let path = path.as_ref();

  let dir = std::fs::read_dir(&path)?.collect::<io::Result<Vec<_>>>()?;

  let entries = dir
    .par_iter()
    .map(|entry| {
      let path = entry.path();
      let name = entry.file_name();
      let is_dir = path.is_dir();
      let is_hidden = is_hidden(&path);
      let is_symlink = is_symlink(&path);
      let is_starred = false;
      let last_modified = last_modified(&path);

      let size = if is_dir {
        0
      } else {
        entry
          .metadata()
          .map(|metadata| metadata.len())
          .unwrap_or(0)
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

      entry
    })
    .collect();

  Ok(entries)
}

pub fn is_symlink(path: impl AsRef<Path>) -> bool {
  let path = path.as_ref();

  let metadata = match path.symlink_metadata() {
    Ok(metadata) => metadata,
    Err(_) => {
      return false;
    }
  };

  metadata.file_type().is_symlink()
}

pub fn last_modified(path: impl AsRef<Path>) -> String {
  let path = path.as_ref();

  let time = match path.metadata() {
    Ok(metadata) =>
      match metadata.modified() {
        Ok(time) => time,
        Err(_) => {
          return String::from("Unknown");
        }
      }

    Err(_) => {
      return String::from("Unknown");
    }
  };

  DateTime::<Utc>::from(time).format("%d/%m/%Y %H:%M").to_string()
}

pub fn open_file(path: impl AsRef<Path>) -> io::Result<()> {
  open::that(path.as_ref())
}

pub fn paste_entries<F>(
  paths: Vec<impl AsRef<Path>>,
  dir: impl AsRef<Path>,
  mut callback: F
)
  where F: FnMut(&Result<u64, io::Error>) + Sync + Send
{
  let dir = dir.as_ref();

  for path in paths {
    let path = path.as_ref();
    let name = path.file_name().unwrap();

    let result: Result<u64, io::Error>;

    if path.is_dir() {
      result = fs_extra::dir
        ::copy(path, dir.with_file_name(&name), &CopyOptions::default())
        .map_err(|e|
          io::Error::new(
            io::ErrorKind::Other,
            format!("failed to copy directory: {:?}", e)
          )
        );
    } else {
      result = std::fs::copy(path, dir.with_file_name(&name));
    }

    callback(&result);
  }
}

pub fn create_entry(path: impl AsRef<Path>) -> io::Result<()> {
  let path = path.as_ref();

  if path.is_dir() {
    std::fs::create_dir_all(path)
  } else {
    std::fs::File::create(path).map(|_| ())
  }
}

pub fn rename_entry(path: impl AsRef<Path>, new_name: &str) -> io::Result<()> {
  let path = path.as_ref();
  let new_path = path.with_file_name(new_name);

  std::fs::rename(path, new_path)
}

pub fn delete_entries<F>(paths: Vec<impl AsRef<Path>>, mut callback: F)
  where F: FnMut(&io::Result<()>) + Sync + Send
{
  for path in paths {
    let path = path.as_ref();

    if path.is_dir() {
      callback(&std::fs::remove_dir(path));
    } else {
      callback(&std::fs::remove_file(path));
    }
  }
}
