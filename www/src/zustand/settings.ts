import {
  SetShowCheckboxes,
  SetShowHidden,
  SetTheme,
  SetView
} from "@wails/methods/config/Config";
import { useEffect } from "react";
import { customCreate } from "./store";

type Theme = "dark" | "light" | "system";
type View = "list" | "grid";

// The json object coming from the backend
type Config = {
  theme: Theme;
  showCheckboxes: boolean;
  showHidden: boolean;
  view: View;
};

export type { Config, Theme, View };

type SettingsState = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  showHidden: boolean;
  setShowHidden: (showHidden: boolean) => void;
  showCheckboxes: boolean;
  setShowCheckboxes: (showCheckboxes: boolean) => void;
  view: View;
  setView: (view: View) => void;
};

const useSettings = customCreate<SettingsState>(set => ({
  theme: "light",
  setTheme: (theme: Theme) => set({ theme }),
  showHidden: true,
  setShowHidden: (showHidden: boolean) => set({ showHidden }),
  showCheckboxes: true,
  setShowCheckboxes: (showCheckboxes: boolean) => set({ showCheckboxes }),
  view: "list",
  setView: (view: View) => set({ view })
}));

export { useSettings };

/**
 * Internally uses an useEffect that
 * watches any changes in the settings and invokkes the
 * backend functions to write to file.
 */
const settingsEffect = () => {
  const [theme, showHidden, showCheckboxes, view] = useSettings(s => [
    s.theme,
    s.showHidden,
    s.showCheckboxes,
    s.view
  ]);

  /**
   * TODO: this sucks
   */
  useEffect(() => {
    SetTheme(theme);
  }, [theme]);

  useEffect(() => {
    SetShowHidden(showHidden);
  }, [showHidden]);

  useEffect(() => {
    SetShowCheckboxes(showCheckboxes);
  }, [showCheckboxes]);

  useEffect(() => {
    SetView(view);
  }, [view]);
};

export { settingsEffect };
