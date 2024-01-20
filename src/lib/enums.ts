enum BackendEvent {
  ShowWindowSwitcher = "show-window-switcher",
  HideWindowSwitcher = "hide-window-switcher",
  ShowMonitorSelector = "show-monitor-selector"
}

enum Command {
  KillProcess = "kill_process",
  ToggleMonitorSelector = "toggle_monitor_selector",
  FocusWindow = "focus_window"
}

export { BackendEvent, Command };
