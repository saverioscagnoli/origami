use std::path::Path;

pub async fn get_size<P: AsRef<Path>>(path: P) -> u64 {
    let path = path.as_ref();

    if path.is_dir() {
        return 0;
    } else {
        match tokio::fs::metadata(path).await {
            Ok(metadata) => metadata.len(),
            Err(_) => 0,
        }
    }
}
