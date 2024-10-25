import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

/**
 * Ctrl + A Selects all entries in the current directory / search results.
 * This hotkey should be prevented when the user is in a text input (e.g. search bar, creating an entry).
 */

function hotkeySelectAllEntries() {
  const [entries, setSelected] = useCurrentDir(s => [s.entries, s.setSelected]);
  const [creating, searching, renaming] = useStates(s => [
    s.creating,
    s.searching,
    s.renaming
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.A,
    () => {
      if (!creating.state && !searching.state && !renaming) {
        setSelected(entries);
      }
    },
    [entries, creating, searching, renaming]
  );
}

export { hotkeySelectAllEntries };
