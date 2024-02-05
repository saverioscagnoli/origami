enum BackendEvent {
  ShowWindowSwitcher = "show-window-switcher",
  HideWindowSwitcher = "hide-window-switcher",
  ShowWindowSelector = "show-window-selector",
  HideWindowSelector = "hide-window-selector",
  ShowMonitorSelector = "show-monitor-selector",
  HideMonitorSelector = "hide-monitor-selector",
  ShowCalculator = "show-calculator",
  HideCalculator = "hide-calculator",
  SendProcesses = "send-processes"
}

enum Command {
  KillProcess = "kill_process",
  ShowWindowSelector = "show_window_selector",
  HideWindowSelector = "hide_window_selector",
  ShowMonitorSelector = "show_monitor_selector",
  HideMonitorSelector = "hide_monitor_selector",
  MinimizeWindow = "minimize_window",
  MaximizeWindow = "maximize_window",
  FocusWindow = "focus_window",
  CloseWindow = "close_window"
}

enum Operator {
  Add = "+",
  Subtract = "-",
  Multiply = "*",
  Divide = "/",
  Power = "^",
  Factorial = "!"
}

enum Function {
  Sine = "sin",
  Cosine = "cos"
}

enum Token {
  Point = ".",
  LeftParen = "(",
  RightParen = ")"
}

export { BackendEvent, Command, Operator, Function, Token };
