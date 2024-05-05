import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { useSettings } from "@hooks/use-settings";
import { DirEntry } from "@typings/dir-entry";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

const checkInvalid = (renaming: DirEntry | null, repeat: boolean) =>
  renaming !== null || repeat;

function setupHotkeys() {
  const { showHidden, showCheckboxes, updateSettings } = useSettings();
  const { renaming, setRenaming } = useGlobalStates();

  /** Toggle show hidden */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyH,
    e => {
      if (checkInvalid(renaming, e.repeat)) return;
      e.preventDefault();

      updateSettings({ showHidden: !showHidden });
    },
    [showHidden, renaming]
  );

  /** Toggle show checkboxes */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyJ,
    e => {
      if (checkInvalid(renaming, e.repeat)) return;
      e.preventDefault();

      updateSettings({ showCheckboxes: !showCheckboxes });
    },
    [showCheckboxes, renaming]
  );

  const { entries, selected, replaceSelected } = useCurrentDir();

  /** Rename hotekey */
  useHotkey(
    [],
    Key.F2,
    e => {
      if (checkInvalid(renaming, e.repeat)) return;
      e.preventDefault();

      if (selected.length === 1) {
        setRenaming(selected.at(0));
      }
    },
    [renaming, selected]
  );

  /** Select all hotkey */
  useHotkey(
    [Modifier.Ctrl],
    Key.KeyA,
    e => {
      if (checkInvalid(renaming, e.repeat)) return;
      e.preventDefault();

      replaceSelected(entries);
    },
    [renaming, selected, entries]
  );
}

export { setupHotkeys };
