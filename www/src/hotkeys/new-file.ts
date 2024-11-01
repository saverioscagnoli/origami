import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCreating } from "~/stores/states";

/**
 * Toggles the visibility of the create dialog for files
 * @default Ctrl + N
 */
function hotkeyNewFile() {
  const setCreating = useCreating(s => s.set);

  useHotkey([Modifier.Ctrl], Key.N, e => {
    e.preventDefault();
    setCreating(prev => ({ state: !prev.state, isDir: false }));
  });
}

export { hotkeyNewFile };
