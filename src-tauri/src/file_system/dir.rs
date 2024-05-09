use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

use super::{file, misc, platform_impl, DirEntry};
use crate::consts::STARRED_DIR_NAME;
use std::{io, path::Path};

pub async fn list_dir<P: AsRef<Path>, Q: AsRef<Path>>(
    dir: P,
    app_config_dir: Q,
) -> io::Result<Vec<DirEntry>> {
    let dir = dir.as_ref();
    let starred_dir = app_config_dir.as_ref().join(STARRED_DIR_NAME);

    let dir = std::fs::read_dir(&dir)?;
    let dir = dir.collect::<io::Result<Vec<_>>>().unwrap();

    let mut entries: Vec<DirEntry> = dir
        .par_iter()
        .filter_map(|entry| {
            let metadata = entry.metadata();

            if metadata.is_err() {
                return None;
            }

            let metadata = metadata.unwrap();

            let path = entry.path();
            let name = entry.file_name();
            let is_dir = metadata.is_dir();

            #[cfg(target_os = "windows")]
            let is_hidden = platform_impl::is_hidden(&metadata);

            #[cfg(not(target_os = "windows"))]
            let is_hidden = platform_impl::is_hidden(&name);

            let is_symlink = misc::is_symlink(&metadata);
            let is_starred = starred_dir.join(&name).exists();
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
        })
        .collect::<Vec<_>>();

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
