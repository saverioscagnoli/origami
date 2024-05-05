use std::{ io, path::Path };
use chrono::{ DateTime, Utc };
use rayon::iter::{ IntoParallelRefIterator, ParallelIterator };
use serde::{ Deserialize, Serialize };

use super::platform_impl;

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct DirEntry {
  pub path: String,
  pub name: String,
  pub is_dir: bool,
  pub is_hidden: bool,
  pub is_symlink: bool,
  pub is_starred: bool,
  pub last_modified: String,
  pub size: u64,
}

pub async fn list_dir(path: String) -> Result<Vec<DirEntry>, String> {
  let path = Path::new(&path);
  let dir = match path.read_dir() {
    Ok(dir) => dir,
    Err(e) => {
      return Err(e.to_string());
    }
  };

  let dir = match dir.collect::<io::Result<Vec<_>>>() {
    Ok(dir) => dir,
    Err(e) => {
      return Err(e.to_string());
    }
  };

  let entries = dir
    .par_iter()
    .map(|entry| {
      let path = entry.path();
      let name = entry.file_name();
      let is_dir = path.is_dir();
      let is_hidden = platform_impl::is_hidden(&path);
      let is_symlink = is_symlink(&path);
      let is_starred = false;
      let last_modified = last_modified(&path);

      let size = if is_dir {
        0
      } else {
        match entry.metadata() {
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
  let path = path.as_ref();
  open::that(path)
}


pub fn rename_entry(path: impl AsRef<Path>, new_name: String) -> io::Result<()> {
  let path = path.as_ref();
  let new_path = path.with_file_name(new_name);
  std::fs::rename(path, new_path)
}

pub fn delete_entry(path: impl AsRef<Path>) -> io::Result<()> {
  let path = path.as_ref();

  if path.is_dir() {
    std::fs::remove_dir_all(&path) 
  } else {
    std::fs::remove_file(&path)
  }
}

pub fn create_entry(path: impl AsRef<Path>, is_dir: bool) -> io::Result<()> {
  let path = path.as_ref();

  if is_dir {
    std::fs::create_dir_all(&path)
  } else {
    std::fs::File::create(&path).map(|_| ())
  }
}