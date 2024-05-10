import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Create a new file
 *
 * @default Ctrl + N
 */

function createNewFileHotkey() {
  const [creating, setCreating, renaming] = useGlobalStates(s => [
    s.creating,
    s.setCreating,
    s.renaming
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.N,
    e => {
      if (isHotkeyInvalid({ renaming, creating, repeat: e.repeat })) return;

      e.preventDefault();
      setCreating({ state: true, isDir: false });
    },
    [creating, renaming]
  );
}

export { createNewFileHotkey };
