use std::path::Path;

use chrono::{DateTime, Utc};

pub async fn is_symlink<P: AsRef<Path>>(path: P) -> bool {
    let path = path.as_ref();

    match tokio::fs::symlink_metadata(&path).await {
        Ok(metadata) => metadata.file_type().is_symlink(),
        Err(_) => false,
    }
}

pub async fn last_modified<P: AsRef<Path>>(path: P) -> String {
    let path = path.as_ref();

    let metadata = match tokio::fs::metadata(&path).await {
        Ok(meta) => meta,
        Err(_) => {
            return "Unknown".into();
        }
    };

    let time = match metadata.modified() {
        Ok(time) => time,
        Err(_) => {
            return "Unknown".into();
        }
    };

    DateTime::<Utc>::from(time).format("%d/%m/%Y %H:%M").to_string()
}
