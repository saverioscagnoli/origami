use std::{
    fs::Metadata,
    io::{self, BufRead, Write},
    path::Path,
};

pub fn get_size(meta: &Metadata) -> u64 {
    if meta.is_dir() {
        return 0;
    } else {
        return meta.len();
    }
}

pub async fn create_file<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::File::create(path).await.map(|_| ())
}

pub async fn delete_file<P: AsRef<Path>>(path: P) -> io::Result<()> {
    tokio::fs::remove_file(path).await
}

pub async fn copy_file<P: AsRef<Path>, Q: AsRef<Path>>(from: P, to: Q) -> io::Result<()> {
    tokio::fs::copy(from, to).await.map(|_| ())
}

use std::time::{Duration, Instant};

pub fn copy_file_with_progress<P: AsRef<Path>, Q: AsRef<Path>, F>(from: P, to: Q, mut callback: F)
where
    F: FnMut(u64, usize) + Send + Sync,
{
    let total = std::fs::metadata(&from).unwrap().len();

    let from = std::fs::File::open(&from).unwrap();
    let to = std::fs::File::create(&to).unwrap();

    let mut buf_r = std::io::BufReader::with_capacity(4096 * 16, from);
    let mut buf_w = std::io::BufWriter::with_capacity(4096 * 16, to);
    let mut copied = 0;

    let mut last_callback = Instant::now();
    let dur = Duration::from_millis(100);

    loop {
        let len = {
            let data = buf_r.fill_buf().unwrap();

            buf_w.write(data).unwrap();
            buf_w.flush().unwrap();

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
