pub enum EventFromFrontend {
  DirChanged,
}

impl EventFromFrontend {
  pub fn as_str(&self) -> &str {
    match self {
      EventFromFrontend::DirChanged => "dir_changed",
    }
  }
}

pub enum EventToFrontend {
  ListDir,
  OpenFile
}

impl EventToFrontend {
  pub fn as_str(&self) -> &str {
    match self {
      EventToFrontend::ListDir => "list_dir",
      EventToFrontend::OpenFile => "open_file",
    }
  }
}
