import { invoke } from "@lib/mapped-invoke";
import { CommandName } from "@typings/enums";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function closeAllWindowsHotkey() {
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.Q, e => {
    e.preventDefault();

    invoke(CommandName.CloseAllWindows);
  });
}

export { closeAllWindowsHotkey };
