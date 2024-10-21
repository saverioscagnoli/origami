import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { JoinPath } from "@wails/methods/utils/Utils";
import { useCurrentDir } from "~/zustand/dir";

/**
 * Ctrl + Up goes to the parent directory.
 */
function hotkeyParentDir() {
  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);

  useHotkey(
    [Modifier.Ctrl],
    Key.ArrowUp,
    async () => {
      const parentDir = await JoinPath([dir, ".."]);
      cd(parentDir);
    },
    [dir]
  );
}

export { hotkeyParentDir };
