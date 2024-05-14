import { invoke } from "@lib/mapped-invoke";
import { isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";

/**
 * Reload current dir
 *
 * @default Ctrl + R
 */

function reloadHotkey() {
  const dir = useCurrentDir(state => state.dir);

  useHotkey(
    [Modifier.Ctrl],
    Key.R,
    e => {
      e.preventDefault();
      if (isHotkeyInvalid({ repeat: e.repeat })) return;

      invoke(CommandName.ListDir, { dir });
    },
    [dir]
  );
}

export { reloadHotkey };
