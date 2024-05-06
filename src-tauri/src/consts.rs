// Hidden file attribute for windows
pub const FILE_ATTRIBUTE_HIDDEN: u32 = 0x00000002;

// Seconds to wait before emitting disk data (i.e to pick up when a usb stick is inserted or removed)
pub const EMIT_DISKS_INTERVAL_SECONDS: u64 = 1;

// Starred dir name, used to store starred files in the app config dir
pub const STARRED_DIR_NAME: &str = "Starred";

// Settings file name, used to store the app settings in the app config dir
pub const SETTINGS_FILE_NAME: &str = "settings.json";

// Copy size threshold, files bigger than this size will be copied in a separate thread
pub const COPY_SIZE_THRESHOLD: usize = 500000000;

// Create no window flag for windows, for example when executing a command via Command::new
pub const FLAG_CREATE_NO_WINDOW: u32 = 0x08000000;
