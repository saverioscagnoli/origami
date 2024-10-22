import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

/**
 * Ctrl + X Cuts the selected entries.
 */
function hotkeyCut() {
  const selected = useCurrentDir(s => s.selected);
  const [setClipboard, creating] = useStates(s => [s.setClipboard, s.creating]);

  useHotkey(
    [Modifier.Ctrl],
    Key.X,
    e => {
      if (creating.state) {
        return;
      }

      e.preventDefault();

      setClipboard({ entries: selected, cut: true });
    },
    [selected, creating]
  );
}

export { hotkeyCut };
