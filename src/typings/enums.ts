enum CommandName {
  ListDir = "list_dir",
  PollDisks = "poll_disks"
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

export { BackendEvent, CommandName, CommandStatus, FrontendEvent, BasicDirLabel };
