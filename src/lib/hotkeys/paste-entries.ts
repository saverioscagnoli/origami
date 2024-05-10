import { isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Pastes entries IN THE CURRENT DIRECTORY
 *
 * @default Ctrl + V
 */

function pasteEntriesHotkey() {
  const push = useCallstack(state => state.push);
  const dir = useCurrentDir(state => state.dir);
  const [renaming, creating, clipboard, setClipboard] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.clipboard,
    state.setClipboard
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.V,
    e => {
      if (isHotkeyInvalid({ renaming, creating, repeat: e.repeat })) return;

      e.preventDefault();
      const paths = clipboard.entries.map(e => e.path);
      push(CommandName.PasteEntries, { paths, dest: dir, cut: clipboard.cut });
      setClipboard({ entries: [], cut: false });
    },
    [renaming, creating, clipboard, dir]
  );
}

export { pasteEntriesHotkey };
