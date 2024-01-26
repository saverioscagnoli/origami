interface Process {
  id: number;
  titles: string[];
  exe_path: string;
  icon: string;
}

type KeyEvent = InputEvent & { target: HTMLInputElement };

type MonitorInfo = { position: [number, number] };

interface MonitorSelectorPayload {
  title: string;
  monitor_info: MonitorInfo[];
}

interface ShowWindowSelectorPayload {
  titles: string[];
  index: number;
}

export type {
  Process,
  KeyEvent,
  MonitorInfo,
  ShowWindowSelectorPayload,
  MonitorSelectorPayload
};
