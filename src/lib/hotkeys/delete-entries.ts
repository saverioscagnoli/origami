import { invoke } from "@lib/mapped-invoke";
import { isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

/**
 * Delete selected entries.
 *
 * @default Delete
 */

function deleteEntriesHotkey() {
  const selected = useCurrentDir(state => state.selected);
  const [renaming, creating, searching] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching
  ]);

  useHotkey(
    Key.Delete,
    e => {
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      e.preventDefault();

      const paths = selected.map(entry => entry.path);
      invoke(CommandName.DeleteEntries, { paths });
    },
    [selected, renaming, creating, searching]
  );
}

export { deleteEntriesHotkey };
