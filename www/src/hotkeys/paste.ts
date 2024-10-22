import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { PasteEntries } from "@wails/methods/fs/Filesystem";
import { useMemo } from "react";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

/**
 * Ctrl + V Pastes the entries from the clipboard into the current directory.
 * Can move if the entries were cut.
 */
function hotkeyPaste() {
  const dir = useCurrentDir(s => s.dir);
  const [clipboard, setClipboard, creating] = useStates(s => [
    s.clipboard,
    s.setClipboard,
    s.creating
  ]);

  const canPaste = useMemo(() => clipboard.entries.length > 0, [clipboard]);

  useHotkey(
    [Modifier.Ctrl],
    Key.V,
    e => {
      if (creating.state) {
        return;
      }

      e.preventDefault();

      PasteEntries(clipboard.entries, dir, clipboard.cut);
      setClipboard({ entries: [], cut: false });
    },
    [dir, clipboard, creating]
  );
}

export { hotkeyPaste };
