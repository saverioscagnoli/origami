import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { replaceSelected, updateSettings } = useDispatchers();
  const { entries } = useCurrentDir();

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyA,
    e => {
      if (e.repeat) return;
      e.preventDefault();

      replaceSelected(entries);
    },
    [entries]
  );

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyH,
    e => {
      if (e.repeat) return;
      e.preventDefault();

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden]
  );

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyJ,
    e => {
      if (e.repeat) return;
      e.preventDefault();

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes]
  );
}

export { setupHotkeys };
