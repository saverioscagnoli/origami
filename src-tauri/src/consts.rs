/* Hidden file attribute for windows */
#[cfg(target_os = "windows")]
pub const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;

/* Starred dir name, found in the app config directory */
pub const STARRED_DIR_NAME: &str = "Starred";

/* Poll interval in seconds. The disks are fetched every x seconds to detect changes. (i.e. usb stick inserted) */
pub const POLL_DISKS_INTERVAL_SECONDS: u64 = 1;

#[cfg(target_os = "windows")]
/* Create no window flag for windows, for example when executing a command via Command::new */
pub const FLAG_CREATE_NO_WINDOW: u32 = 0x08000000;
