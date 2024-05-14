import { isHotkeyInvalid } from "@lib/utils";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useGlobalStates } from "@zustand/global-states-store";

/**
 * Start searching in the current directory.
 *
 * @default Ctrl + F
 */

function searchHereHotkey() {
  const [renaming, creating, searching, setSearching] = useGlobalStates(state => [
    state.renaming,
    state.creating,
    state.searching,
    state.setSearching
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.F,
    e => {
      e.preventDefault();

      if (isHotkeyInvalid({ renaming, creating, repeat: e.repeat })) return;

      if (searching.state) {
        setSearching({ state: false });
      } else {
        setSearching({ state: true, query: "", where: "here" });
      }
    },
    [renaming, creating, searching]
  );
}

export { searchHereHotkey };
