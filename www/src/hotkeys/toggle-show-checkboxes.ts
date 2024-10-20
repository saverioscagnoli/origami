import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useSettings } from "~/zustand/settings";

/**
 * Ctrl + J toggles the visibility of checkboxes next to the entries
 */
function hotkeyToggleShowCheckboxes() {
  const [showCheckboxes, setShowCheckboxes] = useSettings(s => [
    s.showCheckboxes,
    s.setShowCheckboxes
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.J,
    () => {
      setShowCheckboxes(!showCheckboxes);
    },
    [showCheckboxes]
  );
}

export { hotkeyToggleShowCheckboxes };
