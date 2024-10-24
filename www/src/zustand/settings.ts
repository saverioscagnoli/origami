import {
  SetFilter,
  SetShowCheckboxes,
  SetShowHidden,
  SetTheme,
  SetView
} from "@wails/methods/config/Config";
import { config } from "@wails/methods/models";
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
  filter: config.Filter;
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
  filter: config.Filter;
  setFilter: (filter: config.Filter) => void;
};

const useSettings = customCreate<SettingsState>(set => ({
  theme: "light",
  setTheme: (theme: Theme) => set({ theme }),
  showHidden: true,
  setShowHidden: (showHidden: boolean) => set({ showHidden }),
  showCheckboxes: true,
  setShowCheckboxes: (showCheckboxes: boolean) => set({ showCheckboxes }),
  view: "list",
  setView: (view: View) => set({ view }),
  filter: { kind: "name", asc: true },
  setFilter: (filter: config.Filter) => set({ filter })
}));

export { useSettings };

/**
 * Internally uses useEffects that
 * watches any changes in the settings and invokes the
 * backend functions to write to file.
 */
const settingsEffect = () => {
  const [theme, showHidden, showCheckboxes, view, filter] = useSettings(s => [
    s.theme,
    s.showHidden,
    s.showCheckboxes,
    s.view,
    s.filter
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

  useEffect(() => {
    SetFilter(filter);
  }, [filter]);
};

export { settingsEffect };
