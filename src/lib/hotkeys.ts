import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useSettings } from "@hooks/use-settings";
import { DirEntry } from "@typings/dir-entry";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

const checkInvalid = (
  renaming: DirEntry | null,
  creating: Object | null,
  repeat: boolean
) => renaming !== null || repeat || creating !== null;

function setupHotkeys() {
  const { showHidden, showCheckboxes, updateSettings } = useSettings();
  const { renaming, creating, setRenaming, setCreating } = useGlobalStates();

  /** Toggle show hidden */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyH,
    e => {
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden, renaming, creating]
  );

  /** Toggle show checkboxes */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyJ,
    e => {
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes, renaming, creating]
  );

  const { entries, selected, replaceSelected } = useCurrentDir();

  /** Rename hotekey */
  useHotkey(
    [],
    Key.F2,
    e => {
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      if (selected.length === 1) {
        setRenaming(selected.at(0));
      }
    },
    [renaming, selected, creating]
  );

  /** Select all hotkey */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyA,
    e => {
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      replaceSelected(entries);
    },
    [renaming, selected, entries, creating]
  );

  const { deleteEntries } = useCommands();

  /** Delete hotkey */
  useHotkey(
    [],
    Key.Delete,
    e => {
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      deleteEntries(selected.map(e => e.path));
    },
    [renaming, selected, creating]
  );

  /** New file hotkey */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyN,
    e => {
      console.log("hotkey file");
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      setCreating({ state: true, isDir: false });
    },
    [renaming, creating]
  );

  /** New directory hotkey */
  useHotkey(
    [Modifier.Ctrl, Modifier.Shift],
    Key.KeyN,
    e => {
      if (checkInvalid(renaming, creating, e.repeat)) return;
      e.preventDefault();

      setCreating({ state: true, isDir: true });
    },
    [renaming, creating]
  );
}

export { setupHotkeys };
