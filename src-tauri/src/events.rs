pub enum EventFromFrontend {
  DirChanged,
  BeforeUnload,
}

impl EventFromFrontend {
  pub fn as_str(&self) -> &str {
    match self {
      EventFromFrontend::DirChanged => "dir_changed",
      EventFromFrontend::BeforeUnload => "before_unload",
    }
  }
}

pub enum EventToFrontend {
  ListDir,
  OpenFile,
  PasteEntries,
  DeleteEntry,
  Watch,
  SendDisks,
}

impl EventToFrontend {
  pub fn as_str(&self) -> &str {
    match self {
      EventToFrontend::ListDir => "list_dir",
      EventToFrontend::OpenFile => "open_file",
      EventToFrontend::PasteEntries => "paste_entries",
      EventToFrontend::DeleteEntry => "delete_entry",
      EventToFrontend::Watch => "watch",
      EventToFrontend::SendDisks => "send_disks",
    }
  }
}
