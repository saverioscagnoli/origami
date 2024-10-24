import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useStates } from "~/zustand/states";

/**
 * Ctrl + F filters the entries in the current directory.
 */
function hotkeySearchHere() {
  const [searching, setSearching, creating] = useStates(s => [
    s.searching,
    s.setSearching,
    s.creating
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.F,
    e => {
      if (creating.state || e.repeat) return;

      setSearching({ state: !searching.state, where: "here" });
    },
    [searching, creating]
  );
}

export { hotkeySearchHere };
