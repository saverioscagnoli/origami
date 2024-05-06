use std::{ ffi::OsString, io::{ self, Read, Write }, path::{ self, Path } };
use chrono::{ DateTime, Utc };
use rayon::iter::{ IntoParallelRefIterator, ParallelBridge, ParallelIterator };
use serde::{ Deserialize, Serialize };
use walkdir::WalkDir;

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

//pub async fn list_dir(
//   path: impl AsRef<Path>,
//   starred_dir: impl AsRef<Path>
// ) -> Result<Vec<DirEntry>, String> {
//   let path = path.as_ref();
//   let starred_dir = starred_dir.as_ref();

//   let mut dir = match tokio::fs::read_dir(&path).await {
//     Ok(dir) => dir,
//     Err(e) => {
//       return Err(e.to_string());
//     }
//   };

//   let mut entries = vec![];

//   while let Ok(entry) = dir.next_entry().await {
//     if entry.is_none() {
//       continue;
//     }

//     let entry = entry.unwrap();

//     let path = entry.path();
//     let name = entry.file_name();
//     let is_dir = path.is_dir();
//     let is_hidden = platform_impl::is_hidden(&path);
//     let is_symlink = is_symlink(&path);
//     let is_starred = starred_dir.join(&name).exists();
//     let last_modified = last_modified(&path);

//     let size = if is_dir {
//       0
//     } else {
//       match entry.metadata().await {
//         Ok(metadata) => metadata.len(),
//         Err(_) => 0,
//       }
//     };

//     let entry = DirEntry {
//       path: path.to_string_lossy().to_string(),
//       name: name.to_string_lossy().to_string(),
//       is_dir,
//       is_hidden,
//       is_symlink,
//       is_starred,
//       last_modified,
//       size,
//     };

//     entries.push(entry);
//   }

//   entries.sort_by(|a, b| {
//     if a.is_dir == b.is_dir {
//       a.name.to_lowercase().cmp(&b.name.to_lowercase())
//     } else if a.is_dir {
//       std::cmp::Ordering::Less
//     } else {
//       std::cmp::Ordering::Greater
//     }
//   });

//   Ok(entries)
// }

pub async fn list_dir(
  path: impl AsRef<Path>,
  starred_dir: impl AsRef<Path>
) -> Result<Vec<DirEntry>, String> {
  let path = path.as_ref();
  let starred_dir = starred_dir.as_ref();

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

  let mut entries: Vec<DirEntry> = dir
    .par_iter()
    .map(|entry| {
      let path = entry.path();
      let name = entry.file_name();
      let is_dir = path.is_dir();
      let is_hidden = platform_impl::is_hidden(&path);
      let is_symlink = is_symlink(&path);
      let is_starred = starred_dir.join(&name).exists();
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

  entries.sort_by(|a, b| {
    if a.is_dir == b.is_dir {
      a.name.to_lowercase().cmp(&b.name.to_lowercase())
    } else if a.is_dir {
      std::cmp::Ordering::Less
    } else {
      std::cmp::Ordering::Greater
    }
  });

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

use base64::{ engine::general_purpose, Engine };

pub fn get_image_base64(path: impl AsRef<Path>) -> io::Result<String> {
  let path = path.as_ref();
  let image = std::fs::read(path)?;

  Ok(general_purpose::STANDARD.encode(&image))
}

use std::fs;

pub fn copy_dir<P: AsRef<Path>, Q: AsRef<Path>>(from: P, to: Q) -> io::Result<()> {
  let from = from.as_ref();
  let to = to.as_ref();

  fs::create_dir_all(to)?;

  let dir = fs::read_dir(&from)?;

  dir
    .collect::<Result<Vec<_>, _>>()?
    .par_iter()
    .try_for_each(|entry| {
      let path = entry.path();
      let name = entry.file_name();
      let new_path = to.join(&name);

      if path.is_dir() {
        copy_dir(&path, &new_path)
      } else {
        fs::copy(&path, &new_path).map(|_| Ok(()))?
      }
    })?;

  Ok(())
}

pub fn paste_entry<P: AsRef<Path>>(
  path: P,
  new_dir: P,
  is_cutting: bool
) -> io::Result<()> {
  let path = path.as_ref();
  let new_dir = new_dir.as_ref();

  let mut new_name = path.file_name().unwrap().to_os_string();
  let mut new_path = new_dir.join(&new_name);

  let mut i = 1;

  while fs::metadata(&new_path).is_ok() {
    let stem = path.file_stem().unwrap().to_str().unwrap();
    let extension = path.extension().map(|ext| ext.to_str().unwrap());

    new_name = match extension {
      Some(ext) => OsString::from(format!("{} ({}).{}", stem, i, ext)),
      None => OsString::from(format!("{} ({})", stem, i)),
    };

    new_path = new_dir.join(&new_name);
    i += 1;
  }

  if is_cutting {
    fs::rename(path, new_path)?;
  } else {
    if path.is_dir() {
      copy_dir(path, &new_path)?;
    } else {
      fs::copy(&path, &new_path)?;
    }
  }

  Ok(())
}

pub fn get_read_rate_mbps(copied_bytes: u64, elapsed_time: f64) -> f64 {
  (copied_bytes as f64) / (1024.0 * 1024.0 * elapsed_time)
}

// pub fn copy_items_with_progress<P: AsRef<Path>, Q: AsRef<Path>, F>(
//   from: Vec<P>,
//   to: Q,
//   mut callback: F
// ) -> io::Result<()>
//   where F: FnMut(CopyInfo) + Sync + Send
// {
//   let to = to.as_ref();
//   let total_size: u64 = from
//     .iter()
//     .map(|path| get_dir_size(path))
//     .sum();

//   let mut copied_size = 0;

//   for path in from {
//     let path = path.as_ref();
//     let name = path.file_name().unwrap();
//     let new_path = to.join(name);

//     if path.is_dir() {
//       super::dir::copy_dir_with_progress(path, &new_path, |info| {
//         copied_size += info.copied_bytes;
//         callback(CopyInfo {
//           total_bytes: total_size,
//           copied_bytes: copied_size,
//           read_rate: ((copied_size as f64) / (total_size as f64)) * 100.0,
//         });
//       })?;
//     } else {
//       super::file::copy_file_with_progress(path, &new_path, |total, copied| {
//         copied_size += copied;
//         callback(CopyInfo {
//           total_bytes: total_size,
//           copied_bytes: copied_size,
//           read_rate: ((copied_size as f64) / (total_size as f64)) * 100.0,
//         });
//       })?;
//     }
//   }

//   Ok(())
// }
