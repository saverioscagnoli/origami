import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useCurrentDir } from "~/zustand/dir";

/**
 * Ctrl + R reloads the current directory.
 */
function hotkeyReload() {
  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);

  useHotkey(
    [Modifier.Ctrl],
    Key.R,
    () => {
      cd(dir);
    },
    [dir]
  );
}

export { hotkeyReload };
