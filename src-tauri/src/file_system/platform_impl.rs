#[cfg(target_os = "windows")]
use std::fs::Metadata;

#[cfg(not(target_os = "windows"))]
use std::ffi::OsStr;

use std::{io, path::Path, process::Command};

#[cfg(target_os = "windows")]
pub fn is_hidden(meta: &Metadata) -> bool {
    use crate::consts::FILE_ATTRIBUTE_HIDDEN;
    use std::os::windows::fs::MetadataExt;

    meta.file_attributes() & FILE_ATTRIBUTE_HIDDEN != 0
}

#[cfg(not(target_os = "windows"))]
pub fn is_hidden(name: &OsStr) -> bool {
    name.to_string_lossy().starts_with('.')
}

#[cfg(target_os = "windows")]
pub fn open_file<P: AsRef<Path>>(path: P) -> io::Result<()> {
    use crate::consts::FLAG_CREATE_NO_WINDOW;
    use std::os::windows::process::CommandExt;

    let path = path.as_ref().to_str().unwrap();

    Command::new("cmd")
        .args(&["/C", "start", "", path])
        .creation_flags(FLAG_CREATE_NO_WINDOW)
        .status()?;

    Ok(())
}

#[cfg(not(target_os = "windows"))]
pub fn open_file<P: AsRef<Path>>(path: P) -> io::Result<()> {
    let path = path.as_ref().to_str().unwrap();

    Command::new("xdg-open").arg(path).status()?;

    Ok(())
}

#[cfg(target_os = "windows")]
pub fn create_symlink(
  path: impl AsRef<Path>,
  target: impl AsRef<Path>
) -> io::Result<()> {
  use crate::consts::FLAG_CREATE_NO_WINDOW;

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
    use std::os::windows::process::CommandExt;

    if path.is_dir() {
      Command::new("cmd")
        .args(
          &["/C", "mklink", "/J", target.to_str().unwrap(), path.to_str().unwrap()]
        )
        .creation_flags(FLAG_CREATE_NO_WINDOW)
        .output()?;
    } else {
      Command::new("cmd")
        .args(
          &["/C", "mklink", "/h", target.to_str().unwrap(), path.to_str().unwrap()]
        )
        .creation_flags(FLAG_CREATE_NO_WINDOW)
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