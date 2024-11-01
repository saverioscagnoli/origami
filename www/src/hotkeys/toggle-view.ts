import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useConfig } from "~/stores/config";

/**
 * Toggles the view between list and grid
 * @default Ctrl + L
 */
function hotkeyToggleView() {
  const setConfig = useConfig(s => s.set);

  useHotkey([Modifier.Ctrl], Key.L, e => {
    e.preventDefault();
    setConfig(prev => ({ view: prev.view === "list" ? "grid" : "list" }));
  });
}

export { hotkeyToggleView };
