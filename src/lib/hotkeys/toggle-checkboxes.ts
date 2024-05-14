import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useSettings } from "@zustand/settings-store";

/**
 * Toggle checkboxes visibility.
 *
 * @default Ctrl + J
 */

function toggleCheckboxesHotkey() {
  const [showCheckboxes, updateSettings] = useSettings(state => [
    state.showCheckboxes,
    state.updateSettings
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.J,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ repeat: e.repeat })) return;

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes]
  );
}

export { toggleCheckboxesHotkey };
