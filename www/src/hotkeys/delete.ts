import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { DeleteEntries } from "@wails/methods/fs/Filesystem";
import { useCurrentDir } from "~/zustand/dir";

/**
 * Delete selected entries.
 */
function hotkeyDelete() {
  const [selected, setSelected] = useCurrentDir(s => [
    s.selected,
    s.setSelected
  ]);

  useHotkey(
    Key.Delete,
    () => {
      DeleteEntries(selected.map(e => e.Path)).then(() => setSelected([]));
    },
    [selected]
  );
}

export { hotkeyDelete };
