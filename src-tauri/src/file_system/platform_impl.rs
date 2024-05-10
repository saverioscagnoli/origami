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
