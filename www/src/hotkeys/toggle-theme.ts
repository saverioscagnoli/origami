import { Key, Modifier, useHotkey } from "@util-hooks/use-hotkey";
import { useSettings } from "~/zustand/settings";

/**
 * Ctrl + T toggles the theme.
 * There are only two themes: light and dark.
 */
function hotkeyToggleTheme() {
  const [theme, setTheme] = useSettings(s => [s.theme, s.setTheme]);

  useHotkey(
    [Modifier.Ctrl],
    Key.T,
    () => {
      setTheme(theme === "dark" ? "light" : "dark");
    },
    [theme]
  );
}

export { hotkeyToggleTheme };
