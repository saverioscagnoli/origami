import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useStates } from "~/zustand/states";

function hotkeyFolderDialog() {
  const [creating, setCreating] = useStates(s => [s.creating, s.setCreating]);

  useHotkey(
    [Modifier.Ctrl, Modifier.Shift],
    Key.N,
    () => {
      setCreating({ state: !creating.state, isDir: true });
    },
    [creating]
  );
}

export { hotkeyFolderDialog };
