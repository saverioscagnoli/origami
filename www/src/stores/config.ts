import { useEffect } from "react";
import { customCreate } from ".";

type Theme = "dark" | "light" | "system";
type ViewType = "list" | "grid";

type ConfigState = {
  theme: Theme;
  showHidden: boolean;
  showCheckboxes: boolean;
  view: ViewType;
  set: (
    partial:
      | ConfigState
      | Partial<ConfigState>
      | ((state: ConfigState) => ConfigState | Partial<ConfigState>)
  ) => void;
};

export type { ConfigState, Theme, ViewType };

const useConfig = customCreate<ConfigState>(set => ({
  theme: "dark",
  showHidden: true,
  showCheckboxes: true,
  view: "list",
  set: partial =>
    set(state => {
      const newState = typeof partial === "function" ? partial(state) : partial;
      return { ...state, ...newState };
    })
}));

export { useConfig };

/**
 * Watch the theme state and apply changes to the DOM
 * by adding/removing the `dark` class to the `documentElement`
 */
function watchTheme() {
  const theme = useConfig(s => s.theme);

  useEffect(() => {
    document.documentElement.classList.remove("dark");

    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    }
  }, [theme]);
}

export { watchTheme };
