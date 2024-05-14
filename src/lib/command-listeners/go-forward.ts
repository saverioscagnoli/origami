import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

function goForwardHotkey() {
  const [history, index, goForward] = useCurrentDir(state => [
    state.history,
    state.historyIndex,
    state.goForward
  ]);

  const [creating, renaming, searching] = useGlobalStates(s => [
    s.creating,
    s.renaming,
    s.searching
  ]);

  const canGoForward = useMemo(() => index < history.length - 1, [index]);

  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowRight,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ renaming, creating, searching, repeat: e.repeat }))
        return;

      if (canGoForward) goForward();
    },
    [creating, renaming, searching, canGoForward]
  );
}

export { goForwardHotkey };
