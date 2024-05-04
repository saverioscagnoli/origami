type Theme = "light" | "dark" | "system";
type View = "list" | "grid";

type Settings = {
  theme: Theme;
  view: View;
  showHidden: boolean;
  showCheckboxes: boolean;
};

export type { Settings, Theme, View };
