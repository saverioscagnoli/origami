import { Key, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

/**
 * F2 opens the popover to rename an entry.
 */
function hotkeyRenameEntry() {
  const selected = useCurrentDir(s => s.selected);
  const [renaming, setRenaming, creating] = useStates(s => [
    s.renaming,
    s.setRenaming,
    s.creating
  ]);

  useHotkey(
    Key.F2,
    e => {
      e.preventDefault();

      if (selected.length !== 1 || creating.state || e.repeat) {
        return;
      }

      setRenaming(selected[0]);
    },
    [selected, creating, renaming]
  );
}

export { hotkeyRenameEntry };
