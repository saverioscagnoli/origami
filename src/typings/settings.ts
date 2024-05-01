enum SettingsKey {
  Theme = "Theme",
  ShowHidden = "ShowHidden",
  ShowCheckboxes = "ShowCheckboxes",
  ViewType = "ViewType"
}

type Settings = {
  theme: "light" | "dark" | "system";
  showHidden: boolean;
  showCheckboxes: boolean;
  viewType: "list" | "grid";
};

export { SettingsKey };
export type { Settings };
