import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Create a new file
 *
 * @default Ctrl + N
 */

function createNewFileHotkey() {
  const [renaming, creating, searching, setCreating] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setCreating
  ]);
  useHotkey(
    [Modifier.Ctrl],
    Key.N,
    e => {
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      e.preventDefault();
      setCreating({ state: true, isDir: false });
    },
    [creating, renaming, searching]
  );
}

export { createNewFileHotkey };
