import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useSettings } from "@hooks/use-settings";
import { sep } from "@tauri-apps/api/path";
import { DirEntry } from "@typings/dir-entry";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

const checkInvalid = (
  renaming: DirEntry | null,
  creating: Object | null,
  searching: { state: boolean } | null,
  repeat: boolean
) => renaming !== null || repeat || creating !== null || searching.state;

function setupHotkeys() {
  const { showHidden, showCheckboxes, updateSettings } = useSettings();
  const { renaming, creating, searching, setRenaming, setCreating, setSearching } =
    useGlobalStates();

  /** Toggle show hidden */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyH,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden, renaming, searching, creating]
  );

  /** Toggle show checkboxes */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyJ,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes, renaming, creating, searching]
  );

  const { dir, entries, selected, replaceSelected, cd, goToParent } = useCurrentDir();

  /** Rename hotekey */
  useHotkey(
    [],
    Key.F2,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      if (selected.length === 1) {
        setRenaming(selected.at(0));
      }
    },
    [renaming, selected, creating, searching]
  );

  /** Select all hotkey */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyA,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      replaceSelected(entries);
    },
    [renaming, selected, entries, creating, searching]
  );

  const { deleteEntries } = useCommands();

  /** Delete hotkey */
  useHotkey(
    [],
    Key.Delete,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      deleteEntries(selected.map(e => e.path));
    },
    [renaming, selected, creating, searching]
  );

  /** New file hotkey */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyN,
    e => {
      console.log("hotkey file");
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      setCreating({ state: true, isDir: false });
    },
    [renaming, creating, searching]
  );

  /** New directory hotkey */
  useHotkey(
    [Modifier.Ctrl, Modifier.Shift],
    Key.KeyN,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      setCreating({ state: true, isDir: true });
    },
    [renaming, creating, searching]
  );

  /** Search here hotkey */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyF,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      setSearching({ state: true, where: "here", query: "" });
    },
    [renaming, creating, searching]
  );

  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowUp,
    e => {
      if (checkInvalid(renaming, creating, searching, e.repeat)) return;
      e.preventDefault();

      goToParent();
    },
    [dir]
  );
}

export { setupHotkeys };
