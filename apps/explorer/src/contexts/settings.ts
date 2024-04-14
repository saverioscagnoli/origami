import { Accessor } from "@typings/accessor";
import { createContext } from "react";

type Theme = "light" | "dark" | "system";

type SettingsContextValue = {
  theme: Accessor<Theme>;
  showHidden: Accessor<boolean>;
  showCheckboxes: Accessor<boolean>;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

export { SettingsContext };
export type { Theme };
