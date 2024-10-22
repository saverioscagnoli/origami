import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

/**
 * Ctrl + C Copies the selected entries.
 */
function hotkeyCopy() {
  const selected = useCurrentDir(s => s.selected);
  const [setClipboard, creating] = useStates(s => [s.setClipboard, s.creating]);

  useHotkey(
    [Modifier.Ctrl],
    Key.C,
    e => {
      if (creating.state) {
        return;
      }

      e.preventDefault();

      setClipboard({ entries: selected, cut: false });
    },
    [selected, creating]
  );
}

export { hotkeyCopy };
