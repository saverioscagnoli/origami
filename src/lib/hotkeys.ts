import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { replaceSelected, updateSettings, deleteEntries } = useDispatchers();
  const { entries, selected } = useCurrentDir();
  const { creating: creatingState,renaming } = useGlobalStates();
  const { state: creating } = creatingState();


  useHotkey(
    [Modifier.Ctrl],
    Key.KeyA,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      replaceSelected(entries);
    },
    [entries, creating, renaming()]
  );

  const { showHidden, showCheckboxes } = useSettings();

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyH,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden, creating, renaming()]
  );

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyJ,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes, creating, renaming()]
  );

  useHotkey(
    [],
    Key.Delete,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      deleteEntries();
    },
    [selected, creating, renaming()]
  );


  useHotkey(
    [],
    Key.F2,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      renaming.set(selected.at(0));
    },
    [renaming(), selected, creating, renaming()]
  );
}

export { setupHotkeys };
