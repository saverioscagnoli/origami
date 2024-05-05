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

use std::io;

#[cfg(target_os = "windows")]
pub fn create_symlink(
  path: impl AsRef<Path>,
  target: impl AsRef<Path>
) -> io::Result<()> {
  let path = path.as_ref();
  let target = target.as_ref();

  let is_elevated = false; // TODO: check if the app is running as admin

  // Create a symlink if possible, junction / hard link otherwise
  if is_elevated {
    use std::os::windows::fs::symlink_file;
    use std::os::windows::fs::symlink_dir;

    if path.is_dir() {
      symlink_dir(path, path.with_extension("symlink")).unwrap();
    } else {
      symlink_file(path, path.with_extension("symlink")).unwrap();
    }
  } else {
    use std::process::Command;

    if path.is_dir() {
      Command::new("cmd")
        .args(
          &["/C", "mklink", "/J", target.to_str().unwrap(), path.to_str().unwrap()]
        )
        .output()?;
    } else {
      Command::new("cmd")
        .args(
          &["/C", "mklink", "/h", target.to_str().unwrap(), path.to_str().unwrap()]
        )
        .output()?;
    }
  }

  Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn create_symlink(
  path: impl AsRef<Path>,
  target: impl AsRef<Path>
) -> io::Result<()> {
  let path = path.as_ref();
  let target = target.as_ref();

  std::os::unix::fs::symlink(target, path)
}
