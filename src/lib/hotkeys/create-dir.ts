import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Create a new directory in the current directory.
 *
 * @default Ctrl + Shift + N
 */

function createNewDirHotkey() {
  const [renaming, creating, searching, setCreating] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setCreating
  ]);
  useHotkey(
    [Modifier.Ctrl, Modifier.Shift],
    Key.N,
    e => {
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      e.preventDefault();
      setCreating({ state: true, isDir: true });
    },
    [creating, renaming, searching]
  );
}

export { createNewDirHotkey };
