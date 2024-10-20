import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useSettings } from "~/zustand/settings";

/**
 * Ctrl + H toggles the visibility of hidden entries.
 */
function hotkeyToggleShowHidden() {
  const [showHidden, toggleShowHidden] = useSettings(s => [
    s.showHidden,
    s.setShowHidden
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.H,
    () => {
      toggleShowHidden(!showHidden);
    },
    [showHidden]
  );
}

export { hotkeyToggleShowHidden };
