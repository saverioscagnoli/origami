import { useSettings } from "@contexts/settings";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { replaceSelected } = useDispatchers();
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

  useHotkey([Modifier.Ctrl], Key.KeyH, e => {
    if (e.repeat) return;
    e.preventDefault();

    showHidden.toggle();
  });

  useHotkey([Modifier.Ctrl], Key.KeyJ, e => {
    if (e.repeat) return;
    e.preventDefault();

    showCheckboxes.toggle();
  });
}

export { setupHotkeys };
