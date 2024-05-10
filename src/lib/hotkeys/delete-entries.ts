import { isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Delete selected entries.
 *
 * @default Delete
 */

function deleteEntriesHotkey() {
  const push = useCallstack(state => state.push);
  const selected = useCurrentDir(state => state.selected);
  const [renaming, creating] = useGlobalStates(s => [s.renaming, s.creating]);

  useHotkey(
    Key.Delete,
    e => {
      if (isHotkeyInvalid({ renaming, creating, repeat: e.repeat })) return;

      e.preventDefault();

      const paths = selected.map(entry => entry.path);
      push(CommandName.DeleteEntries, { paths });
    },
    [selected, renaming, creating]
  );
}

export { deleteEntriesHotkey };
