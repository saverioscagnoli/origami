pub enum BackendEvent {
    ShowWindowSwitcher,
    HideWindowSwitcher,
    ShowWindowSelector,
    HideWindowSelector,
    ShowMonitorSelector,
    HideMonitorSelector,
    ShowCalculator,
    HideCalculator,
    SendProcesses,
}

impl BackendEvent {
    pub fn as_str(&self) -> &'static str {
        match self {
            BackendEvent::ShowWindowSwitcher => "show-window-switcher",
            BackendEvent::HideWindowSwitcher => "hide-window-switcher",
            BackendEvent::ShowWindowSelector => "show-window-selector",
            BackendEvent::HideWindowSelector => "hide-window-selector",
            BackendEvent::ShowMonitorSelector => "show-monitor-selector",
            BackendEvent::HideMonitorSelector => "hide-monitor-selector",
            BackendEvent::ShowCalculator => "show-calculator",
            BackendEvent::HideCalculator => "hide-calculator",
            BackendEvent::SendProcesses => "send-processes",
        }
    }
}

pub enum WindowLabel {
    WindowSwitcher,
    WindowSelector,
    MonitorSelector,
    Calculator,
}

impl WindowLabel {
    pub fn as_str(&self) -> &'static str {
        match self {
            WindowLabel::WindowSwitcher => "window-switcher",
            WindowLabel::WindowSelector => "window-selector",
            WindowLabel::MonitorSelector => "monitor-selector",
            WindowLabel::Calculator => "calculator",
        }
    }

    pub fn iter() -> impl Iterator<Item = WindowLabel> {
        vec![
            WindowLabel::WindowSwitcher,
            WindowLabel::WindowSelector,
            WindowLabel::MonitorSelector,
            WindowLabel::Calculator,
        ]
        .into_iter()
    }
}

#[derive(Clone)]
pub enum HotKeyName {
    WindowSwitcher,
    Calculator,
}

impl Copy for HotKeyName {}
