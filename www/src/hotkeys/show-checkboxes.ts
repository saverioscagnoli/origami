import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useConfig } from "~/stores/config";

/**
 * Toggles the visibility of checkboxes
 * @default Ctrl + J
 */
function hotkeyShowCheckboxes() {
  const setConfig = useConfig(s => s.set);

  useHotkey([Modifier.Ctrl], Key.J, e => {
    e.preventDefault();
    setConfig(prev => ({ showCheckboxes: !prev.showCheckboxes }));
  });
}

export { hotkeyShowCheckboxes };
