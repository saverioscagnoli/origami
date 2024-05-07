use std::path::Path;

#[cfg(target_os = "windows")]
pub async fn is_hidden<P: AsRef<Path>>(path: P) -> bool {
    use crate::consts::FILE_ATTRIBUTE_HIDDEN;
    use std::os::windows::fs::MetadataExt;

    let path = path.as_ref();

    let metadata = match tokio::fs::metadata(&path).await {
        Ok(meta) => meta,
        Err(_) => {
            return false;
        }
    };

    metadata.file_attributes() & FILE_ATTRIBUTE_HIDDEN != 0
}

#[cfg(not(target_os = "windows"))]
pub async fn is_hidden<P: AsRef<Path>>(path: P) -> bool {
    let path = path.as_ref();

    path.file_name()
        .map(|name| name.to_string_lossy().starts_with('.'))
        .unwrap_or(false)
}
