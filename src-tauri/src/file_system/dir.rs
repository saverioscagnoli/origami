use rayon::iter::ParallelIterator;

use super::{file, DirEntry};
use std::{io, path::Path};

pub fn list_dir<P: AsRef<Path>, Q: AsRef<Path>, F>(
    dir: P,
    starred_dir: Q,
    mut callback: F,
) -> io::Result<Vec<DirEntry>>
where
    F: FnMut(Vec<DirEntry>) + Sync + Send,
{
    let dir = dir.as_ref();
    let starred_dir = starred_dir.as_ref();

    let chunk_size = 1000;

    let dir = std::fs::read_dir(&dir)?;

    let mut entries = Vec::new();

    for (i, entry) in dir.enumerate() {
        let entry = entry?;
        let path = entry.path();

        let entry = super::into_entry(&path, Some(starred_dir));

        if let Some(entry) = entry {
            entries.push(entry);
        }

        if i > 0 && i % chunk_size == 0 {
            callback(entries.clone());
            entries.clear();
        }
    }

    Ok(entries)
}

use rayon::iter::ParallelBridge;
use walkdir::WalkDir;

pub fn get_size<P: AsRef<Path>>(path: P) -> u64 {
    let path = path.as_ref();

    WalkDir::new(&path)
        .into_iter()
        .par_bridge()
        .filter_map(Result::ok)
        .map(|entry| entry.metadata().map(|metadata| metadata.len()).unwrap_or(0))
        .sum()
}

pub async fn create_dir<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::create_dir_all(path).await
}

pub async fn delete_dir<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::remove_dir_all(path).await
}

pub async fn copy_dir<P: AsRef<Path>, Q: AsRef<Path>>(path: P, to: Q) -> io::Result<()> {
    let mut stack = vec![path.as_ref().to_path_buf()];

    while let Some(from) = stack.pop() {
        let to = to.as_ref().join(from.strip_prefix(path.as_ref()).unwrap());

        if from.is_dir() {
            tokio::fs::create_dir(&to).await?;

            stack.extend(
                std::fs::read_dir(&from)?
                    .map(|entry| entry.unwrap().path())
                    .collect::<Vec<_>>(),
            );
        } else {
            file::copy_file(&from, &to).await?;
        }
    }

    Ok(())
}

pub fn copy_dir_with_progress<P: AsRef<Path>, Q: AsRef<Path>, F>(
    from: P,
    to: Q,
    mut callback: F,
) -> io::Result<()>
where
    F: FnMut(u64, usize) + Sync + Send,
{
    let from = from.as_ref();
    let to = to.as_ref();

    let total_size = get_size(from);
    let mut total_copied_bytes: usize = 0;

    for entry in WalkDir::new(from).into_iter().filter_map(|e| e.ok()) {
        let source_path = entry.path();
        let relative_path = source_path.strip_prefix(from).unwrap();
        let target_path = to.join(relative_path);

        if source_path.is_dir() {
            std::fs::create_dir_all(&target_path)?;
        } else {
            let mut copied_bytes = 0;

            file::copy_file_with_progress(source_path, &target_path, |_total, copied| {
                copied_bytes = copied;
                callback(total_size, total_copied_bytes + copied_bytes);
            });

            total_copied_bytes += copied_bytes;
        }
    }

    Ok(())
}
