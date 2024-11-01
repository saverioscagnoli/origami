import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { DeleteEntries } from "@wails/go/fs/Filesystem";
import { useDir } from "~/stores/dir";

/**
 * Deletes the selected entries
 * @default Delete
 */
function hotkeyDelete() {
  const selected = useDir(s => s.selected);

  useHotkey(
    Key.Delete,
    e => {
      e.preventDefault();
      DeleteEntries(selected.map(e => e.path));
    },
    [selected]
  );
}

export { hotkeyDelete };
