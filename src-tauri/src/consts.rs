/* Hidden file attribute for windows */
pub const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;

/* Starred dir name, found in the app config directory */
pub const STARRED_DIR_NAME: &str = "Starred";

/* Poll interval in seconds. The disks are fetched every x seconds to detect changes. (i.e. usb stick inserted) */
pub const POLL_DISKS_INTERVAL_SECONDS: u64 = 1;
