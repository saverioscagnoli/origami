#[cfg(target_os = "windows")]
use std::fs::Metadata;

#[cfg(not(target_os = "windows"))]
use std::ffi::OsStr;

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
