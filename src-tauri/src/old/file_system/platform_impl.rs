// In this file there are all the funciton regarding the file system
// That are different for at least 2 operating systems

use std::path::Path;

#[cfg(target_os = "windows")]
pub fn is_hidden(path: impl AsRef<Path>) -> bool {
  use std::os::windows::fs::MetadataExt;

  use crate::consts::FILE_ATTRIBUTE_HIDDEN;

  let path = path.as_ref();

  let metadata = match path.metadata() {
    Ok(metadata) => metadata,
    Err(_) => {
      return false;
    }
  };

  (metadata.file_attributes() & FILE_ATTRIBUTE_HIDDEN) != 0
}

#[cfg(not(target_os = "windows"))]
pub fn is_hidden(path: impl AsRef<Path>) -> bool {
  let path = path.as_ref();

  let name = match path.file_name() {
    Some(name) => name,
    None => {
      return false;
    }
  };

  name.to_string_lossy().starts_with('.')
}
