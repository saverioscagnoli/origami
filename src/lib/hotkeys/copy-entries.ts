import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Copies entries to the cliboard
 *
 * @default Ctrl + C
 */

function copyEntriesHotkey() {
  const selected = useCurrentDir(state => state.selected);
  const [renaming, creating, searching, setClipboard] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setClipboard
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.C,
    e => {
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      e.preventDefault();
      setClipboard({ entries: selected, cut: false });
    },
    [selected, creating, renaming, searching]
  );
}

export { copyEntriesHotkey };
