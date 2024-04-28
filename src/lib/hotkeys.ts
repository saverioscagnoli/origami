import { useCurrentDir } from "@contexts/current-dir";
import { useSettings } from "@contexts/settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { dir, entries, selected } = useCurrentDir();

  useHotkey([Modifier.Ctrl], Key.KeyA, () => selected.set(entries()), [dir()]);

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey([Modifier.Ctrl], Key.KeyH, showHidden.toggle);
  useHotkey([Modifier.Ctrl], Key.KeyJ, showCheckboxes.toggle);
}

export { setupHotkeys };
