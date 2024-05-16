use std::path::PathBuf;
use std::{fs::Metadata, io, path::Path};

pub fn get_size(meta: &Metadata) -> u64 {
    if meta.is_dir() {
        return 0;
    } else {
        return meta.len();
    }
}

pub async fn create_file<P: AsRef<Path>>(path: P) -> io::Result<File> {
    tokio::fs::File::create(path).await
}

pub async fn delete_file<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::remove_file(path).await
}

pub async fn copy_file<P: AsRef<Path>, Q: AsRef<Path>>(from: P, to: Q) -> io::Result<PathBuf> {
    let from = from.as_ref();
    let mut to = to.as_ref().to_path_buf();

    while to.exists() {
        let name = to.file_name().unwrap();
        let new_name = format!("{}-copy", name.to_string_lossy());
        to = to.with_file_name(new_name);
    }

    tokio::fs::copy(from, &to).await.map(|_| ())?;

    Ok(to)
}

use std::time::{Duration, Instant};

use tokio::fs::File;
use tokio::io::{AsyncBufReadExt, AsyncWriteExt};

use crate::consts::COPY_FILE_EVENT_INTERVAL_MS;

pub async fn copy_file_with_progress<P: AsRef<Path>, Q: AsRef<Path>, F>(
    from: P,
    to: Q,
    mut callback: F,
) where
    F: FnMut(u64, usize) + Send + Sync,
{
    let from = from.as_ref();
    let  to = to.as_ref();


    let total = tokio::fs::metadata(&from).await.unwrap().len();

    let from = tokio::fs::File::open(&from).await.unwrap();

    let to = create_file(&to).await.unwrap();

    let mut buf_r = tokio::io::BufReader::with_capacity(4096 * 16, from);
    let mut buf_w = tokio::io::BufWriter::with_capacity(4096 * 16, to);
    let mut copied = 0;

    let mut last_callback = Instant::now();
    let dur = Duration::from_millis(COPY_FILE_EVENT_INTERVAL_MS);

    loop {
        let len = {
            let data = buf_r.fill_buf().await.unwrap();

            buf_w.write(data).await.unwrap();
            buf_w.flush().await.unwrap();

            data.len()
        };

        copied += len;

        if last_callback.elapsed() >= dur {
            callback(total, copied);
            last_callback = Instant::now();
        }

        if len == 0 {
            break;
        }

        buf_r.consume(len);
    }
}
