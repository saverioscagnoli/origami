import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { useSettings } from "@hooks/use-settings";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function setupHotkeys() {
  const { replaceSelected, updateSettings, pasteEntries, deleteEntries } =
    useDispatchers();
  const { entries, selected, dir } = useCurrentDir();
  const { creating: creatingState, renaming, cutting, copying } = useGlobalStates();
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

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyC,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      copying.set(selected);
    },
    [creating, renaming(), selected, copying()]
  );

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyX,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      cutting.set(selected);
    },
    [creating, renaming(), selected, cutting()]
  );

  useHotkey(
    [Modifier.Ctrl],
    Key.KeyV,
    e => {
      if (e.repeat || creating || renaming()) return;
      e.preventDefault();

      pasteEntries();
    },
    [creating, dir, selected, renaming(), cutting(), copying()]
  );
}

export { setupHotkeys };
