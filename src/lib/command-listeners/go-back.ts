import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

function goBackHotkey() {
  const [index, goBack] = useCurrentDir(s => [s.historyIndex, s.goBack]);
  const [creating, renaming, searching] = useGlobalStates(s => [
    s.creating,
    s.renaming,
    s.searching
  ]);

  const canGoBack = useMemo(() => index > 0, [index]);

  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowLeft,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      if (canGoBack) goBack();
    },
    [creating, renaming, searching, canGoBack]
  );
}

export { goBackHotkey };
