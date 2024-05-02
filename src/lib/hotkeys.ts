import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { replaceSelected, updateSettings, deleteEntries } = useDispatchers();
  const { entries, selected } = useCurrentDir();
  const { creating: creatingState } = useGlobalStates();
  const { state: creating } = creatingState();

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyA,
    e => {
      if (e.repeat || creating) return;
      e.preventDefault();

      replaceSelected(entries);
    },
    [entries, creating]
  );

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyH,
    e => {
      if (e.repeat || creating) return;
      e.preventDefault();

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden, creating]
  );

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyJ,
    e => {
      if (e.repeat || creating) return;
      e.preventDefault();

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes, creating]
  );

  useHotkey(
    [],
    Key.Delete,
    e => {
      if (e.repeat || creating) return;
      e.preventDefault();

      deleteEntries();
    },
    [selected, creating]
  );
}

export { setupHotkeys };
