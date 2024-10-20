import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useStates } from "~/zustand/states";

/**
 * Ctrl + N toggles the dialog to crate a file.
 */
function hotkeyFileDialog() {
  const [creating, setCreating] = useStates(s => [s.creating, s.setCreating]);

  useHotkey(
    [Modifier.Ctrl],
    Key.N,
    () => {
      setCreating({ state: !creating.state, isDir: false });
    },
    [creating]
  );
}

export { hotkeyFileDialog };
