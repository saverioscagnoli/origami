use rayon::iter::{IntoParallelRefIterator, ParallelIterator};

use super::{file, misc, platform_impl, DirEntry};
use crate::consts::STARRED_DIR_NAME;
use std::{io, path::Path};

// pub async fn list_dir<P: AsRef<Path>, Q: AsRef<Path>>(
//     dir: P,
//     app_config_dir: Q,
// ) -> io::Result<Vec<DirEntry>> {
//     let dir = dir.as_ref();
//     let starred_dir = app_config_dir.as_ref().join(STARRED_DIR_NAME);

//     let mut entries = vec![];

//     let mut iter = tokio::fs::read_dir(&dir).await?;

//     while let Ok(entry) = iter.next_entry().await {
//         if entry.is_none() {
//             break;
//         }

//         let entry = entry.unwrap();
//         let path = entry.path();
//         let name = entry.file_name();
//         let is_dir = path.is_dir();
//         let is_hidden = platform_impl::is_hidden(&path).await;
//         let is_symlink = misc::is_symlink(&path).await;
//         let is_starred = starred_dir.join(&name).exists();
//         let last_modified = misc::last_modified(&path).await;
//         let size = file::get_size(&path).await;

//         let entry = DirEntry {
//             path: path.to_string_lossy().to_string(),
//             name: name.to_string_lossy().to_string(),
//             is_dir,
//             is_hidden,
//             is_symlink,
//             is_starred,
//             last_modified,
//             size,
//         };

//         entries.push(entry);
//     }

//     entries.sort_by(|a, b| {
//         if a.is_dir == b.is_dir {
//             a.name.to_lowercase().cmp(&b.name.to_lowercase())
//         } else if a.is_dir {
//             std::cmp::Ordering::Less
//         } else {
//             std::cmp::Ordering::Greater
//         }
//     });

//     Ok(entries)
// }

pub async fn list_dir<P: AsRef<Path>, Q: AsRef<Path>>(
    dir: P,
    app_config_dir: Q,
) -> io::Result<Vec<DirEntry>> {
    let dir = dir.as_ref();
    let starred_dir = app_config_dir.as_ref().join(STARRED_DIR_NAME);

    let dir = std::fs::read_dir(&dir)?;
    let dir = dir.collect::<io::Result<Vec<_>>>().unwrap();

    let mut entries: Vec<DirEntry> = dir.par_iter().map(|entry| {
        let path = entry.path();
        let name = entry.file_name();
        let is_dir = path.is_dir();
        let is_hidden = true;
        let is_symlink = true;
        let is_starred = starred_dir.join(&name).exists();
        let last_modified = "Unknown".to_string();
        let size = 10000000;

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

        entry
    }).collect();

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
