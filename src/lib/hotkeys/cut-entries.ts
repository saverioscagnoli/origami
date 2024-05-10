import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

/** Copies entries to the cliboard (Cutting)
 *
 * @default Ctrl + X
 */

function cutEntriesHotkey() {
  const selected = useCurrentDir(state => state.selected);
  const [renaming, creating, setClipboard] = useGlobalStates(s => [
    s.renaming,
    s.creating,
    s.setClipboard
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.X,
    e => {
      if (isHotkeyInvalid({ renaming, creating, repeat: e.repeat })) return;

      e.preventDefault();
      setClipboard({ entries: selected, cut: true });
    },
    [selected, creating, renaming]
  );
}

export { cutEntriesHotkey };
