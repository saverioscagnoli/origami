enum CommandName {
  ListDir = "list_dir"
}

enum CommandStatus {
  Ready = 0,
  Pending = 1,
  Success = 2,
  Error = 3,
  Abort = 4
}

export { CommandName, CommandStatus };
