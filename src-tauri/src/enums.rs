pub enum BackendEvent {
    ShowWindowSwitcher,
    HideWindowSwitcher,
    ShowMonitorSelector,
}

pub enum Consts {
    MonitorEntryHeight = 48,
}

impl ToString for BackendEvent {
    fn to_string(&self) -> String {
        match self {
            BackendEvent::ShowWindowSwitcher => "show-window-switcher".to_string(),
            BackendEvent::HideWindowSwitcher => "hide-window-switcher".to_string(),
            BackendEvent::ShowMonitorSelector => "show-monitor-selector".to_string(),
            // Other
        }
    }
}
