import { invoke } from "@tauri-apps/api/core";
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
 * @property {View} view - The current view of the workspace.
 * @property {boolean} showHidden - Whether to show hidden files or not.
 * @property {boolean} showCheckboxes - Whether to show checkboxes for selection or not.
 * @property {function} updateSettings - A function to update the settings.
 */

type Theme = "light" | "dark" | "system";
type View = "grid" | "list";

interface SettingsStore {
  theme: Theme;
  view: View;
  showHidden: boolean;
  showCheckboxes: boolean;
  updateSettings: (settings: Partial<Omit<SettingsStore, "updateSettings">>) => void;
}

const useSettings = create<SettingsStore>()(set => ({
  theme: "system",
  view: "list",
  showCheckboxes: true,
  showHidden: false,
  updateSettings: settings => {
    set(state => ({ ...state, ...settings }));

    for (const key in settings) {
      if (settings[key] !== undefined) {
        invoke("update_settings", { key, value: `${settings[key]}` });
      }
    }
  }
}));

const ThemeWatcher: FC<ChildrenProps> = ({ children }) => {
  const [theme, updateSettings] = useSettings(s => [s.theme, s.updateSettings]);

  useEffect(() => {
    invoke<SettingsStore>("load_settings").then(updateSettings);
  }, []);

  useEffect(() => {
    document.documentElement.classList.add("light", "dark");

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
