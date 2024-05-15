use serde::{Deserialize, Serialize};

pub mod commands;
pub mod dir;
pub mod file;
pub mod misc;
pub mod platform_impl;

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

use std::path::Path;

/**
 * Converts a path to a DirEntry.
 */
pub fn into_entry<P: AsRef<Path>, Q: AsRef<Path>>(
    path: P,
    starred_dir: Option<Q>,
) -> Option<DirEntry> {
    let path = path.as_ref();

    let metadata = path.metadata();

    if metadata.is_err() {
        return None;
    }

    let metadata = metadata.unwrap();

    let name = path.file_name();

    if name.is_none() {
        log::error!("Failed to get file name for path: {:?}", path);
        return None;
    }

    let name = name.unwrap();

    let is_dir = metadata.is_dir();

    #[cfg(target_os = "windows")]
    let is_hidden = platform_impl::is_hidden(&metadata);

    #[cfg(not(target_os = "windows"))]
    let is_hidden = platform_impl::is_hidden(&name);

    let is_symlink = misc::is_symlink(&path);
    let is_starred = if starred_dir.is_some() {
        starred_dir.unwrap().as_ref().join(&name).exists()
    } else {
        false
    };
    let last_modified = misc::last_modified(&metadata);
    let size = file::get_size(&metadata);

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

    Some(entry)
}

use std::io;

pub fn copy_items_with_progress<P: AsRef<Path>, Q: AsRef<Path>, R: AsRef<Path>, F, G>(
    from: Vec<P>,
    to: Q,
    starred_dir: R,
    mut callback: F,
    mut on_entry_copied: G,
) -> io::Result<()>
where
    F: FnMut(u64, usize) + Sync + Send,
    G: FnMut(DirEntry, bool) + Sync + Send,
{
    let to = to.as_ref();
    let total_size: u64 = from.iter().map(|path| dir::get_size(path)).sum();

    let mut copied_size = 0;

    for (i, path) in from.iter().enumerate() {
        let path = path.as_ref();
        let name = path.file_name().unwrap();
        let new_path = to.join(name);

        let mut current_copied_size = 0;

        if path.is_dir() {
            dir::copy_dir_with_progress(path, &new_path, |_total, copied| {
                current_copied_size = copied;
                callback(total_size, copied_size + current_copied_size);
            })?;
        } else {
            file::copy_file_with_progress(path, &new_path, |_total, copied| {
                current_copied_size = copied;
                callback(total_size, copied_size + current_copied_size);
            });
        }

        copied_size += current_copied_size;

        let new_path = to.join(name);
        let entry = into_entry(new_path, Some(&starred_dir)).unwrap();
        on_entry_copied(entry, i == from.len() - 1);
    }

    Ok(())
}
