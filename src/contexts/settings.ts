import { useAccessor } from "@hooks/use-accessor";
import { createContextHook, createContextProvider } from "@lib/utils";
import { Accessor } from "@typings/accessor";
import { createContext, useEffect } from "react";

type Theme = "light" | "dark" | "system";

type SettingsContextValue = {
  theme: Accessor<Theme>;
  showHidden: Accessor<boolean>;
  showCheckboxes: Accessor<boolean>;
};

const SettingsContextMenu = createContext<SettingsContextValue | null>(null);

const useSettings = createContextHook(SettingsContextMenu, "Settings");

const SettingsProvider = createContextProvider(
  SettingsContextMenu,
  () => {
    const theme = useAccessor<Theme>("dark");
    const showHidden = useAccessor<boolean>(false);
    const showCheckboxes = useAccessor<boolean>(true);

    useEffect(() => {
      document.documentElement.classList.add("light", "dark");

      switch (theme()) {
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
    }, [theme()]);

    return {
      theme,
      showHidden,
      showCheckboxes
    };
  }
);

export { useSettings, SettingsProvider };
