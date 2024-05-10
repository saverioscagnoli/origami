use std::{fs::Metadata, io, path::Path};

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
