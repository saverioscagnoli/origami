pub enum BackendEvent {
    ShowWindowSwitcher,
    HideWindowSwitcher,
}

impl ToString for BackendEvent {
    fn to_string(&self) -> String {
        match self {
            BackendEvent::ShowWindowSwitcher => "show-window-switcher".to_string(),
            BackendEvent::HideWindowSwitcher => "hide-window-switcher".to_string(),
            // Other
        }
    }
}
