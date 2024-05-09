use std::fs::Metadata;

pub fn get_size(meta: &Metadata) -> u64 {
    if meta.is_dir() {
        return 0;
    } else {
        return meta.len();
    }
}
