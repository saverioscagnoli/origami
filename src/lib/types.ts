interface Process {
  id: number;
  titles: string[];
  exe_path: string;
  icon: string;
}

type KeyEvent = InputEvent & { target: HTMLInputElement };

export type { Process, KeyEvent };
