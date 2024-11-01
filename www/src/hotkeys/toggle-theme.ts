import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useConfig } from "~/stores/config";

/**
 * Toggles the theme between `dark` and `light`
 * @default Ctrl + T
 */
function hotkeyToggleTheme() {
  const setConfig = useConfig(s => s.set);

  useHotkey([Modifier.Ctrl], Key.T, e => {
    e.preventDefault();
    setConfig(s => ({ theme: s.theme === "dark" ? "light" : "dark" }));
  });
}

export { hotkeyToggleTheme };
