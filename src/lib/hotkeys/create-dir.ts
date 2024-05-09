import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Create a new directory in the current directory.
 *
 * @default Ctrl + Shift + N
 */

function createNewDirHotkey() {
  const [creating, setCreating, renaming] = useGlobalStates(s => [
    s.creating,
    s.setCreating,
    s.renaming
  ]);

  useHotkey(
    [Modifier.Ctrl, Modifier.Shift],
    Key.N,
    e => {
      if (isHotkeyInvalid(renaming, creating, e.repeat)) return;

      e.preventDefault();
      setCreating({ state: true, isDir: true });
    },
    [creating, renaming]
  );
}

export { createNewDirHotkey };
