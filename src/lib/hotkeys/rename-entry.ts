import { isHotkeyInvalid } from "@lib/utils";
import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Rename the selected entry.
 *
 * @default F2
 */
function renameEntryHotkey() {
  const [renaming, creating, searching, setRenaming] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setRenaming
  ]);

  const selected = useCurrentDir(state => state.selected);

  useHotkey(
    Key.F2,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      if (selected.length === 1) {
        setRenaming(selected.at(0)!);
      }
    },
    [renaming, creating, selected, searching]
  );
}

export { renameEntryHotkey };
