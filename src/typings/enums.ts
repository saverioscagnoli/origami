enum Command {
  LoadSettings = "load_settings",
  UpdateSettings = "update_settings",
  ListDir = "list_dir",
  PollDisks = "poll_disks",
  OpenFiles = "open_files",
  RenameEntry = "rename_entry",
  DeleteEntries = "delete_entries",
  CreateEntry = "create_entry",
  StarEntries = "star_entries",
  UnstarEntries = "unstar_entries",
  PasteEntries = "paste_entries",
  GetImageBase64 = "get_image_base64",
  CloseWindow = "close_window"
}

enum BackendEvent {
  SendDisks = "send_disks",
  CopyProgress = "copy_progress",
  CopyOver = "copy_over"
}

enum FrontendEvent {
  BeforeUnload = "before_unload"
}

enum BasicDirLabel {
  Starred = "starred",
  Home = "home",
  Desktop = "desktop",
  Downloads = "downloads",
  Documents = "documents",
  Pictures = "pictures"
}

enum WindowLabel {
  Main = "main",
  Copy = "copy"
}

export { BackendEvent, BasicDirLabel, Command, FrontendEvent, WindowLabel };
