use std::fs::Metadata;

use chrono::{DateTime, Utc};

pub fn is_symlink(meta: &Metadata) -> bool {
    meta.file_type().is_symlink()
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
