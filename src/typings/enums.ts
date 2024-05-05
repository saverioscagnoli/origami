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
  GetImageBase64 = "get_image_base64"
}

enum BackendEvent {
  SendDisks = "send_disks"
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

export { BackendEvent, BasicDirLabel, Command, FrontendEvent };
