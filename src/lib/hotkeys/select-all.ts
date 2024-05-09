import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

/**
 * Select all entries in the current directory.
 *
 * @default Ctrl + A
 */
function selectAllHotkey() {
  const [entries, selected, replaceSelected] = useCurrentDir(state => [
    state.entries,
    state.selected,
    state.replaceSelected
  ]);

  const [creating, renaming] = useGlobalStates(s => [s.creating, s.renaming]);

  useHotkey(
    [Modifier.Ctrl],
    Key.A,
    e => {
      if (isHotkeyInvalid(renaming, creating, e.repeat)) return;

      e.preventDefault();
      replaceSelected(entries);
    },
    [entries, selected, creating, renaming]
  );
}

export { selectAllHotkey };