enum CommandName {
  PollDisks = "poll_disks",
  ListDir = "list_dir",
  CreateEntry = "create_entry",
  DeleteEntries = "delete_entries"
}

enum CommandStatus {
  Ready = 0,
  Pending = 1,
  Success = 2,
  Error = 3,
  Abort = 4
}

enum FrontendEvent {
  BeforeUnload = "before_unload"
}

enum BackendEvent {
  SendDisks = "send_disks"
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
