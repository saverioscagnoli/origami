import { useGlobalStates } from "@hooks/use-global-states";
import { useSettings } from "@hooks/use-settings";
import { DirEntry } from "@typings/dir-entry";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

const checkInvalid = (renaming: DirEntry | null, repeat: boolean) =>
  renaming !== null || repeat;

function setupHotkeys() {
  const { showHidden, showCheckboxes, updateSettings } = useSettings();
  const { renaming } = useGlobalStates();

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
}

export { setupHotkeys };
