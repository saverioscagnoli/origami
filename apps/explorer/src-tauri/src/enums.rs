#[derive(Debug)]
pub enum EventFromFrontend {
  StopEmittingDisks,
}

impl EventFromFrontend {
  pub fn as_str(&self) -> &str {
    match self {
      Self::StopEmittingDisks => "stop-emitting-disks",
    }
  }
}

pub enum EventToFrontend {
  DirListed(bool),
  SendDisks,
  CssModule,
}

impl EventToFrontend {
  pub fn as_str(&self) -> &str {
    match self {
      Self::DirListed(true) => "dir-listed",
      Self::DirListed(false) => "dir-listed-fail",
      Self::SendDisks => "send-disks",
      Self::CssModule => "css-module",
    }
  }
}
