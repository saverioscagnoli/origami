use std::{ fs::{ self }, io, iter::once, path::Path };
use chrono::{ DateTime, Utc };
use fs_extra::dir::CopyOptions;
use rayon::iter::{ ParallelBridge, ParallelIterator };
use walkdir::WalkDir;

#[cfg(windows)]
use winapi::um::{ fileapi::GetFileAttributesW, winnt::FILE_ATTRIBUTE_HIDDEN };
#[cfg(windows)]
use std::os::windows::ffi::OsStrExt;

use crate::structs::Entry;

pub struct FSManager {}

impl FSManager {
  pub fn new() -> Self {
    Self {}
  }

  pub async fn read_dir<P: AsRef<Path>, Q: AsRef<Path>>(
    &self,
    path: P,
    starred_dir: Q
  ) -> Vec<Entry> {
    let path = path.as_ref();
    let mut entries: Vec<Entry> = Vec::new();

    for entry in fs::read_dir(path).unwrap() {
      let entry = entry.unwrap();

      let name = entry.file_name().to_string_lossy().to_string();
      let path = entry.path();
      let is_folder = path.is_dir();

      if is_folder && !self.can_read_dir(&path) {
        continue;
      }

      let is_hidden = self.is_hidden(path.to_string_lossy().to_string());
      let is_symlink = self.is_symlink(&path);
      let is_starred = self.exists(starred_dir.as_ref().join(entry.file_name()));

      let last_modified = fs::metadata(&path).unwrap().modified().unwrap();
      let last_modified: String = DateTime::<Utc>
        ::from(last_modified)
        .format("%d/%m/%Y %H:%M")
        .to_string();

      let size = {
        if is_folder {
          0
        } else {
          self.get_file_size(path.to_string_lossy().to_string()).await
        }
      };

      entries.push(Entry {
        name,
        path: path.to_string_lossy().to_string(),
        is_folder,
        is_hidden,
        is_symlink,
        is_starred,
        last_modified,
        size,
      });
    }

    entries
  }

  pub fn create_entry<P: AsRef<Path>>(
    &self,
    dir: P,
    name: String,
    is_folder: bool
  ) -> io::Result<()> {
    let path = dir.as_ref().join(name);

    if is_folder {
      fs::create_dir_all(path)?;
    } else {
      fs::File::create(path)?;
    }

    Ok(())
  }

  pub fn delete_entry<P: AsRef<Path>>(
    &self,
    dir: P,
    name: String,
    is_folder: bool
  ) -> io::Result<()> {
    let path = dir.as_ref().join(name);

    if is_folder {
      fs::remove_dir_all(path)?;
    } else {
      fs::remove_file(path)?;
    }

    Ok(())
  }

  pub fn create_symlink<P: AsRef<Path>, Q: AsRef<Path>>(
    &self,
    target_dir: P,
    link_dir: Q,
    name: String,
    is_folder: bool
  ) -> io::Result<()> {
    let target_path = target_dir.as_ref().join(&name);
    let link_path = link_dir.as_ref().join(&name);

    #[cfg(windows)]
    {
      if is_folder {
        use std::os::windows::fs::symlink_dir;
        symlink_dir(target_path, link_path)?;
      } else {
        use std::os::windows::fs::symlink_file;
        symlink_file(target_path, link_path)?;
      }
    }

    #[cfg(unix)]
    {
      use std::os::unix::fs::symlink;
      symlink(target_path, link_path)?;
    }

    Ok(())
  }

  pub fn paste<P: AsRef<Path>, Q: AsRef<Path>>(
    &self,
    source: P,
    target: Q,
    cutting: bool
  ) -> io::Result<()> {
    let source = source.as_ref();
    let target = target.as_ref().join(source.file_name().unwrap());

    if cutting {
      fs::rename(source, target)?;
    } else {
      if source.is_dir() {
        let mut options = CopyOptions::new();
        options.overwrite = true;
        options.copy_inside = true;

        fs_extra::dir
          ::copy(source, target, &options)
          .map_err(|e|
            std::io::Error::new(std::io::ErrorKind::Other, e.to_string())
          )?;
      } else {
        fs::copy(source, target)?;
      }
    }

    Ok(())
  }

  pub fn can_read_dir<P: AsRef<Path>>(&self, path: P) -> bool {
    match fs::read_dir(path) {
      Ok(_) => true,
      Err(_) => false,
    }
  }

  pub fn exists<P: AsRef<Path>>(&self, path: P) -> bool {
    fs::metadata(path).is_ok()
  }

  pub fn is_hidden(&self, path: String) -> bool {
    #[cfg(windows)]
    {
      let path = Path::new(&path);
      let wide_string: Vec<u16> = path
        .as_os_str()
        .encode_wide()
        .chain(once(0))
        .collect();
      let attributes = unsafe { GetFileAttributesW(wide_string.as_ptr()) };
      (attributes & FILE_ATTRIBUTE_HIDDEN) != 0
    }

    #[cfg(unix)]
    {
      Path::new(&path).file_name().unwrap().to_string_lossy().starts_with('.')
    }
  }

  pub fn is_symlink<P: AsRef<Path>>(&self, path: P) -> bool {
    fs::symlink_metadata(&path).unwrap().file_type().is_symlink()
  }

  pub async fn get_file_size(&self, path: String) -> u64 {
    let is_folder = Path::new(&path).is_dir();
    let size = {
      if is_folder {
        WalkDir::new(path)
          .into_iter()
          .filter_map(|entry| entry.ok())
          .par_bridge()
          .filter_map(|entry| entry.metadata().ok())
          .filter(|metadata| !metadata.is_dir())
          .map(|metadata| metadata.len())
          .sum()
      } else {
        fs::metadata(&path).unwrap().len()
      }
    };

    size
  }
}