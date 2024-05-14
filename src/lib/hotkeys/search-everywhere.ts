import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useGlobalStates } from "@zustand/global-states-store";

/**
 * Start searching everywhere.
 *
 * @default Ctrl + Shift + F
 */
function searchEverywhereHotkey() {
  const [renaming, creating, searching, setSearching] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setSearching
  ]);

  useHotkey(
    [Modifier.Ctrl, Modifier.Shift],
    Key.F,
    e => {
      e.preventDefault();

      if (isHotkeyInvalid({ renaming, creating, repeat: e.repeat })) return;

      if (searching.state) {
        setSearching({ state: false });
      } else {
        setSearching({ state: true, query: "", where: "everywhere" });
      }
    },
    [renaming, creating, searching]
  );
}

export { searchEverywhereHotkey };
