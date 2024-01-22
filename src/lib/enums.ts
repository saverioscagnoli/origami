enum BackendEvent {
  ShowWindowSwitcher = "show-window-switcher",
  HideWindowSwitcher = "hide-window-switcher",
  ShowWindowSelector = "show-window-selector",
  HideWindowSelector = "hide-window-selector",
  ShowMonitorSelector = "show-monitor-selector",
  HideMonitorSelector = "hide-monitor-selector"
}

enum Command {
  KillProcess = "kill_process",
  ShowWindowSelector = "show_window_selector",
  HideWindowSelector = "hide_window_selector",
  ShowMonitorSelector = "show_monitor_selector",
  HideMonitorSelector = "hide_monitor_selector",
  FocusWindow = "focus_window"
}

export { BackendEvent, Command };
