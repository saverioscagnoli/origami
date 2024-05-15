/* Hidden file attribute for windows */
#[cfg(target_os = "windows")]
pub const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;

/* Starred dir name, found in the app config directory */
pub const STARRED_DIR_NAME: &str = "Starred";

/* Config file name, found in the app config dir */
pub const CONFIG_FILE_NAME: &str = "config.jsonc";

/* Poll interval in seconds. The disks are fetched every x seconds to detect changes. (i.e. usb stick inserted) */
pub const POLL_DISKS_INTERVAL_SECONDS: u64 = 1;

#[cfg(target_os = "windows")]
/* Create no window flag for windows, for example when executing a command via Command::new */
pub const FLAG_CREATE_NO_WINDOW: u32 = 0x08000000;

/* Copy size threshold, files bigger than this size will be copied in a separate thread */
pub const COPY_SIZE_THRESHOLD: u64 = 786_432_000; // 750 MB

/* Settings file name, found in the app config dir */
pub const SETTINGS_FILE_NAME: &str = "settings.json";

/* Index file name, found in the app config dir */
pub const INDEX_FILE_NAME: &str = "index.json";

/* The interval at which the backend should communicate the copying progress */
pub const COPY_FILE_EVENT_INTERVAL_MS: u64 = 100;
