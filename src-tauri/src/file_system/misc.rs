use base64::{engine::general_purpose, Engine};
use chrono::{DateTime, Utc};
use std::{fs::Metadata, io, path::Path};

pub fn is_symlink<P: AsRef<Path>>(path: P) -> bool {
    let symlink_meta = std::fs::symlink_metadata(path);

    match symlink_meta {
        Ok(meta) => meta.is_symlink(),
        Err(_) => false,
    }
}

pub fn last_modified(meta: &Metadata) -> String {
    let time = match meta.modified() {
        Ok(time) => time,
        Err(_) => {
            return "Unknown".into();
        }
    };

    DateTime::<Utc>::from(time)
        .format("%d/%m/%Y %H:%M")
        .to_string()
}

pub async fn rename_entry<P: AsRef<Path>, Q: AsRef<Path>>(
    old_path: P,
    new_path: Q,
) -> io::Result<()> {
    tokio::fs::rename(old_path, new_path).await
}

pub async fn image_to_base64(img: Vec<u8>) -> String {
    general_purpose::STANDARD.encode(&img)
}
