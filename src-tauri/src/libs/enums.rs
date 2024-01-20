pub enum BackendEvent {
    ShowWindowSwitcher,
    HideWindowSwitcher,
    ShowMonitorSelector,
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

pub enum WindowLabel {
    WindowSwitcher,
    WindowSelector,
    MonitorSelector,
}

impl ToString for WindowLabel {
    fn to_string(&self) -> String {
        match self {
            WindowLabel::WindowSwitcher => "window-switcher".to_string(),
            WindowLabel::WindowSelector => "window-selector".to_string(),
            WindowLabel::MonitorSelector => "monitor-selector".to_string(),
            // Other
        }
    }
}
