import { isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

/**
 * Reload current dir
 *
 * @default Ctrl + R
 */

function reloadHotkey() {
  const push = useCallstack(state => state.push);
  const dir = useCurrentDir(state => state.dir);

  useHotkey(
    [Modifier.Ctrl],
    Key.R,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ repeat: e.repeat })) return;

      push(CommandName.ListDir, { dir });
    },
    [dir]
  );
}

export { reloadHotkey };
