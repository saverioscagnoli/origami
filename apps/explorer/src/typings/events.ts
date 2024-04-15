enum EventFromBackend {
  DirListed = "dir-listed",
  DirListedFail = "dir-listed-fail",
  SendDisks = "send-disks",
  CssModule = "css-module"
}

enum EventToBackend {
  StopEmittingDisks = "stop-emitting-disks",
  StopCalculatingSize = "stop-calculating-size"
}

export { EventFromBackend, EventToBackend };
