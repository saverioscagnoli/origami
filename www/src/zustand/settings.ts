import { customCreate } from "./store";

type Theme = "dark" | "light" | "system";
type View = "list" | "grid";

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
