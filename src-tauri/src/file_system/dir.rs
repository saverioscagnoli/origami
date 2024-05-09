use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

use super::DirEntry;
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
        .filter_map(|entry| super::into_entry(entry.path(), &starred_dir))
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

pub async fn create_dir<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::create_dir_all(path).await
}

pub async fn delete_dir<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::remove_dir_all(path).await
}
