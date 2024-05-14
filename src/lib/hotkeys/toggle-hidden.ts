import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useSettings } from "@zustand/settings-store";

/**
 * Toggle hidden files visibility.
 *
 * @default Ctrl + H
 */

function toggleHiddenHotkey() {
  const [showHidden, updateSettings] = useSettings(state => [
    state.showHidden,
    state.updateSettings
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.H,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ repeat: e.repeat })) return;

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden]
  );
}

export { toggleHiddenHotkey };
