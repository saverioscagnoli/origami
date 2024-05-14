import { invoke } from "@lib/mapped-invoke";
import { CommandName } from "@typings/enums";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";

function newWindowHotkey() {
  useHotkey([Modifier.Ctrl, Modifier.Shift], Key.W, e => {
    e.preventDefault();

    invoke(CommandName.SpawnMainWindow);
  });
}

export { newWindowHotkey };
