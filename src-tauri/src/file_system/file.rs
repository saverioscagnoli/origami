use std::path::Path;

pub fn get_size<P: AsRef<Path>>(path: P) -> u64 {
    let path = path.as_ref();

    if path.is_dir() {
        return 0;
    } else {
        match std::fs::metadata(path) {
            Ok(metadata) => metadata.len(),
            Err(_) => 0,
        }
    }
}
