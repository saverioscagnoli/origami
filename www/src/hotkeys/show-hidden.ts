import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useConfig } from "~/stores/config";

/**
 * Toggles the visibility of hidden files and directories
 * @default Ctrl + H
 */
function hotkeyShowHidden() {
  const setConfig = useConfig(s => s.set);

  useHotkey([Modifier.Ctrl], Key.H, e => {
    e.preventDefault();
    setConfig(prev => ({ showHidden: !prev.showHidden }));
  });
}

export { hotkeyShowHidden };
