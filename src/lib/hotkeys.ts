import { useSettings } from "@contexts/settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { showHidden, showCheckboxes } = useSettings();

  useHotkey([Modifier.Ctrl], Key.KeyH, showHidden.toggle);
  useHotkey([Modifier.Ctrl], Key.KeyJ, showCheckboxes.toggle);
}

export { setupHotkeys };
