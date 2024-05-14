import { invoke } from "@lib/mapped-invoke";
import { getParentDir, isHotkeyInvalid } from "@lib/utils";
import { CommandName } from "@typings/enums";
import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";

function goToParentDirHotkey() {
  const dir = useCurrentDir(state => state.dir);
  const [creating, renaming, searching] = useGlobalStates(state => [
    state.creating,
    state.renaming,
    state.searching
  ]);

  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowUp,
    async e => {
      e.preventDefault();
      if (isHotkeyInvalid({ creating, renaming, searching, repeat: e.repeat }))
        return;

      invoke(CommandName.ListDir, { dir: await getParentDir(dir) });
    },
    [dir, creating, renaming, searching]
  );
}

export { goToParentDirHotkey };
