enum EventToBackend {
  DirChanged = "dir_changed",
  BeforeUnload = "before_unload"
}

enum EventFromBackend {
  SendDisks = "send_disks"
}

export { EventToBackend, EventFromBackend };
