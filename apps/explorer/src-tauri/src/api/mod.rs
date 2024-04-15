use std::{ collections::HashMap, fs, io, path::{ Path, PathBuf }, process::Command };
use chrono::{ DateTime, Utc };
use serde::{ Deserialize, Serialize };

pub mod commands;

#[derive(Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct DirEntry {
  name: String,
  is_dir: bool,
  is_hidden: bool,
  is_symlink: bool,
  is_starred: bool,
  last_modified: String,
  size: u64,
}

pub struct Api {
  pub starred_dir: PathBuf,
}

impl Api {
  pub fn new(config_dir: PathBuf) -> Self {
    Self {
      starred_dir: config_dir.join("Starred"),
    }
  }

  pub fn init(&self) {
    if !self.starred_dir.exists() {
      fs::create_dir_all(&self.starred_dir).expect(
        "Failed to create starred directory"
      );
    }
  }

  pub fn read_dir<P>(&self, path: P) -> Result<HashMap<String, DirEntry>, io::Error>
    where P: AsRef<Path>
  {
    let path = path.as_ref();
    let mut entries: HashMap<String, DirEntry> = HashMap::new();

    for entry in fs::read_dir(path)? {
      let entry = entry?;

      let path = entry.path();
      let name: String = entry.file_name().to_string_lossy().to_string();

      let is_dir = path.is_dir();
      let is_hidden = self.hidden(&path)?;
      let is_symlink = self.symlink(&path)?;
      let is_starred = self.starred_dir.join(&name).exists();
      let last_modified = self.last_modified(&path)?;

      let size = match is_dir {
        true => 0,
        false =>
          match fs::metadata(&path) {
            Ok(metadata) => metadata.len(),
            Err(e) => {
              return Err(io::Error::new(io::ErrorKind::Other, e.to_string()));
            }
          }
      };

      entries.insert(path.to_string_lossy().to_string(), DirEntry {
        name,
        is_dir,
        is_hidden,
        is_symlink,
        is_starred,
        last_modified,
        size,
      });
    }

    Ok(entries)
  }

  pub fn cut_or_copy<P, Q>(
    &self,
    old_path: P,
    new_path: Q,
    cutting: bool
  )
    -> Result<(), io::Error>
    where P: AsRef<Path>, Q: AsRef<Path>
  {
    let old_path = old_path.as_ref();
    let new_path = new_path.as_ref();

    if cutting {
      self.rename_entry(&old_path, &new_path)
    } else {
      match fs::copy(&old_path, &new_path) {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
      }
    }
  }

  pub fn create_entry<P>(&self, path: P, is_dir: bool) -> Result<(), io::Error>
    where P: AsRef<Path>
  {
    let path = path.as_ref();

    if is_dir {
      fs::create_dir_all(&path)
    } else {
      fs::File::create(&path).map(|_| ())
    }
  }

  pub fn rename_entry<P, Q>(&self, old_path: P, new_path: Q) -> Result<(), io::Error>
    where P: AsRef<Path>, Q: AsRef<Path>
  {
    let path = old_path.as_ref();
    let new_path = new_path.as_ref();

    fs::rename(path, new_path)
  }

  pub fn delete_entry<P>(&self, path: P) -> Result<(), io::Error>
    where P: AsRef<Path>
  {
    let path = path.as_ref();

    if path.is_dir() {
      fs::remove_dir_all(&path)
    } else {
      fs::remove_file(&path)
    }
  }

  fn hidden<P>(&self, path: P) -> Result<bool, io::Error> where P: AsRef<Path> {
    let path = path.as_ref();

    #[cfg(target_os = "windows")]
    {
      use std::os::windows::fs::MetadataExt;

      const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;

      let metadata = match path.metadata() {
        Ok(metadata) => metadata,
        Err(e) => {
          return Err(io::Error::new(io::ErrorKind::Other, e.to_string()));
        }
      };

      let is_hidden = (metadata.file_attributes() & FILE_ATTRIBUTE_HIDDEN) != 0;

      Ok(is_hidden)
    }

    #[cfg(not(target_os = "windows"))]
    {
      let name = match path.file_name() {
        Some(name) => name,
        None => {
          return Err(
            io::Error::new(io::ErrorKind::Other, "Failed to get file name")
          );
        }
      };

      Ok(name.to_string_lossy().starts_with('.'))
    }
  }

  fn symlink<P>(&self, path: P) -> Result<bool, io::Error> where P: AsRef<Path> {
    let path = path.as_ref();

    #[cfg(windows)]
    {
      if path.is_dir() {
        let metadata = match fs::symlink_metadata(&path) {
          Ok(metadata) => metadata,
          Err(e) => {
            return Err(io::Error::new(io::ErrorKind::Other, e.to_string()));
          }
        };

        Ok(metadata.file_type().is_symlink())
      } else {
        Ok(false)
      }
    }

    #[cfg(unix)]
    {
      match fs::symlink_metadata(path) {
        Ok(metadata) => Ok(metadata.file_type().is_symlink()),
        Err(e) => {
          return Err(io::Error::new(io::ErrorKind::Other, e.to_string()));
        }
      }
    }
  }

  fn last_modified<P>(&self, path: P) -> Result<String, io::Error>
    where P: AsRef<Path>
  {
    let path = path.as_ref();

    let time = fs::metadata(&path)?.modified()?;
    let date: String = DateTime::<Utc>
      ::from(time)
      .format("%d/%m/%Y %H:%M")
      .to_string();

    Ok(date)
  }

  pub fn create_symlink<P, Q>(
    &self,
    target_path: P,
    link_path: Q
  )
    -> Result<(), io::Error>
    where P: AsRef<Path>, Q: AsRef<Path>
  {
    let target_path = target_path.as_ref();
    let link_path = link_path.as_ref();

    #[cfg(windows)]
    {
      use std::os::windows::fs::symlink_dir as symlink_path_windows;
      use std::os::windows::fs::symlink_file as symlink_file_windows;

      use std::{ iter::once, os::windows::ffi::OsStrExt, ffi::OsStr, ptr::null_mut };
      use winapi::um::winbase::CreateHardLinkW;

      let is_elevated = false; // utils::is_elevated().unwrap_or(false);

      // Create symlink if it can, otherwise create junction for folders and hard link for files

      if is_elevated {
        if target_path.is_dir() {
          symlink_path_windows(target_path, link_path)
        } else {
          symlink_file_windows(target_path, link_path)
        }
      } else {
        if target_path.is_dir() {
          let result = match
            Command::new("cmd")
              .args(
                &[
                  "/C",
                  "mklink",
                  "/J",
                  link_path.to_str().unwrap(),
                  target_path.to_str().unwrap(),
                ]
              )
              .output()
          {
            Ok(_) => Ok(()),
            Err(e) => {
              return Err(io::Error::new(io::ErrorKind::Other, e.to_string()));
            }
          };
          result
        } else {
          let existing_filename: Vec<u16> = OsStr::new(&target_path)
            .encode_wide()
            .chain(once(0))
            .collect();
          let new_filename: Vec<u16> = OsStr::new(&link_path)
            .encode_wide()
            .chain(once(0))
            .collect();

          let result = unsafe {
            CreateHardLinkW(
              new_filename.as_ptr(),
              existing_filename.as_ptr(),
              null_mut()
            )
          };

          if result == 0 {
            return Err(io::Error::last_os_error());
          }

          Ok(())
        }
      }
    }

    #[cfg(unix)]
    {
      use std::os::unix;

      match unix::fs::symlink(target_path, link_path) {
        Ok(_) => Ok(()),
        Err(e) => {
          return Err(io::Error::new(io::ErrorKind::Other, e.to_string()));
        }
      }
    }
  }
}
