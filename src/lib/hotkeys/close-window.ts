import { getCurrent } from "@tauri-apps/api/window";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function closeWindowHotkey() {
  useHotkey([Modifier.Ctrl], Key.Q, e => {
    e.preventDefault();

    const win = getCurrent();
    win.close();
  });
}

export { closeWindowHotkey };
