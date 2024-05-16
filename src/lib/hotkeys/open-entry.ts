import { invoke } from "@lib/mapped-invoke";
import { isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

/**
 * The hotkey to open the selected entry.
 *
 * @default Enter
 */
function openEntryHotkey() {
  const [selected, cd] = useCurrentDir(state => [state.selected, state.cd]);
  const [searching, renaming, creating] = useGlobalStates(state => [
    state.searching,
    state.renaming,
    state.creating
  ]);

  useHotkey(
    Key.Enter,
    e => {
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      e.preventDefault();

      if (selected.length === 1 && selected.at(0).isDir) {
        cd(selected.at(0).path);
      } else if (selected.every(e => !e.isDir)) {
        const paths = selected.map(e => e.path);

        invoke(CommandName.OpenFiles, { paths });
      }
    },
    [searching, renaming, creating, selected]
  );
}

export { openEntryHotkey };
