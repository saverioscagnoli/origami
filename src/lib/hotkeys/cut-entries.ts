import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

/** Copies entries to the cliboard (Cutting)
 *
 * @default Ctrl + X
 */

function cutEntriesHotkey() {
  const selected = useCurrentDir(state => state.selected);
  const [renaming, creating, searching, setClipboard] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setClipboard
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.X,
    e => {
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      e.preventDefault();
      setClipboard({ entries: selected, cut: true });
    },
    [selected, creating, renaming, searching]
  );
}

export { cutEntriesHotkey };
