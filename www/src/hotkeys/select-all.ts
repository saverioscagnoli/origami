import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useDir } from "~/stores/dir";

/**
 * Selects all entries in the current directory
 * @default Ctrl + A
 */
function hotkeySelectAll() {
  const selectAll = useDir(s => s.selectAll);

  useHotkey([Modifier.Ctrl], Key.A, e => {
    e.preventDefault();
    selectAll();
  });
}

export { hotkeySelectAll };
