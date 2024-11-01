import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCreating } from "~/stores/states";

/**
 * Toggles the visibility of the create dialog for folders
 * @default Ctrl + Shift + N
 */
function hotkeyNewFolder() {
  const setCreating = useCreating(s => s.set);

  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.N, e => {
    e.preventDefault();
    setCreating(prev => ({ state: !prev.state, isDir: true }));
  });
}

export { hotkeyNewFolder };
