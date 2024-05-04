enum Command {
  ListDir = "list_dir",
  PollDisks = "poll_disks"
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
  Pictures = "pictures",
}

export { BackendEvent, Command, FrontendEvent, BasicDirLabel };
