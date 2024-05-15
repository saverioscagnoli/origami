import { invoke } from "@lib/mapped-invoke";
import { emit } from "@tauri-apps/api/event";
import { CommandName, FrontendEvent } from "@typings/enums";
import { ChildrenProps } from "@typings/props";
import { FC, useEffect } from "react";
import { create } from "zustand";

////////////////////////////////
//                            //
//          Settings          //
//                            //
////////////////////////////////

/**
 * This is the store for all the settings related to the user workspace.
 *
 * @interface SettingsStore
 *
 * @property {Theme} theme - The current theme of the workspace.
 * @property {function} setTheme - A function to set the theme (mainly used to set theme in another window).
 * @property {View} view - The current view of the workspace.
 * @property {boolean} showHidden - Whether to show hidden files or not.
 * @property {boolean} showCheckboxes - Whether to show checkboxes for selection or not.
 * @property {function} updateSettings - A function to update the settings.
 */

type Theme = "light" | "dark" | "system";
type View = "grid" | "list";

interface SettingsStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  view: View;
  showHidden: boolean;
  showCheckboxes: boolean;
  loadSettings: (settings: Omit<SettingsStore, "updateSettings">) => void;
  updateSettings: (settings: Partial<Omit<SettingsStore, "updateSettings">>) => void;
}

const useSettings = create<SettingsStore>()(set => ({
  theme: "system",
  setTheme: (theme: Theme) => set({ theme }),
  view: "list",
  showCheckboxes: true,
  showHidden: false,
  loadSettings: settings => {
    set(state => ({ ...state, ...settings }));
  },
  updateSettings: settings => {
    set(state => ({ ...state, ...settings }));

    for (const key in settings) {
      if (settings[key] !== undefined) {
        invoke(CommandName.UpdateSettings, { key, value: `${settings[key]}` });
      }
    }
  }
}));

const ThemeWatcher: FC<ChildrenProps> = ({ children }) => {
  const theme = useSettings(state => state.theme);

  useEffect(() => {
    document.documentElement.classList.add("light", "dark");

    emit(FrontendEvent.ThemeChange, theme);

    switch (theme) {
      case "light": {
        document.documentElement.classList.remove("dark");
        break;
      }

      case "dark": {
        document.documentElement.classList.remove("light");
        break;
      }

      case "system": {
        if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
          document.documentElement.classList.add("dark");
        } else {
          document.documentElement.classList.add("light");
        }
      }
    }
  }, [theme]);

  return <>{children}</>;
};

export { ThemeWatcher, useSettings };
export type { SettingsStore, Theme, View };
