import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useDir } from "~/stores/dir";

/**
 * Reloads the current directory
 * @default Ctrl + R
 */
function hotkeyReload() {
  const reload = useDir(s => s.reload);

  useHotkey([Modifier.Ctrl], Key.R, e => {
    e.preventDefault();
    reload();
  });
}

export { hotkeyReload };
