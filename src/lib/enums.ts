enum BackendEvent {
  ShowWindowSwitcher = "show-window-switcher",
  HideWindowSwitcher = "hide-window-switcher",
  ShowWindowSelector = "show-window-selector",
  HideWindowSelector = "hide-window-selector",
  ShowMonitorSelector = "show-monitor-selector",
  HideMonitorSelector = "hide-monitor-selector"
}

enum Command {
  KillProcess = "kill_process"
}

export { BackendEvent, Command };
