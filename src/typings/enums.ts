enum CommandName {
  PollDisks = "poll_disks",
  ListDir = "list_dir",
  CreateEntry = "create_entry",
  DeleteEntries = "delete_entries",
  RenameEntry = "rename_entry",
  OpenFiles = "open_files",
  PasteEntries = "paste_entries",
  StarEntries = "star_entries",
  UnstarEntries = "unstar_entries",
  FilterEnties = "filter_entries",

  SpawnMainWindow = "spawn_main_window",
  CloseAllWindows = "close_all_windows",
  GetImageBase64 = "get_image_base64",
  BuildIndex = "build_index",
  SearchEverywhere = "search_everywhere",
  WatchDiskChanges = "watch_disk_changes",
  LoadCSSModules = "load_css_modules",
  LoadSettings = "load_settings",
  UpdateSettings = "update_settings",
  LoadConfig = "load_config"
}

enum CommandStatus {
  Ready = 0,
  Pending = 1,
  Success = 2,
  Error = 3,
  Abort = 4
}

enum FrontendEvent {
  BeforeUnload = "before_unload",
  ThemeChange = "theme_change"
}

enum BackendEvent {
  SendDisks = "send_disks",
  CopyStart = "copy_start",
  CopyProgress = "copy_progress",
  CopyOver = "copy_over"
}

enum BasicDirLabel {
  Starred = "starred",
  Home = "home",
  Desktop = "desktop",
  Downloads = "downloads",
  Documents = "documents",
  Pictures = "pictures"
}

export { BackendEvent, BasicDirLabel, CommandName, CommandStatus, FrontendEvent };
