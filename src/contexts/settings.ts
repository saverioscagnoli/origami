import { useAccessor } from "@hooks/use-accessor";
import { createContextHook, createContextProvider } from "@lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { Accessor } from "@typings/accessor";
import { Command } from "@typings/command";
import { Settings, SettingsKey } from "@typings/settings";
import { createContext, useEffect } from "react";

type Theme = "light" | "dark" | "system";
type ViewType = "list" | "grid";

type SettingsContextValue = {
  theme: Accessor<Theme>;
  showHidden: Accessor<boolean>;
  showCheckboxes: Accessor<boolean>;
  viewType: Accessor<ViewType>;
};

const SettingsContextMenu = createContext<SettingsContextValue | null>(null);

const useSettings = createContextHook(SettingsContextMenu, "Settings");

const SettingsProvider = createContextProvider(SettingsContextMenu, () => {
  const theme = useAccessor<Theme>("dark");
  const showHidden = useAccessor<boolean>(false);
  const showCheckboxes = useAccessor<boolean>(true);
  const viewType = useAccessor<ViewType>("list");

  useEffect(() => {
    invoke<Settings>(Command.LoadSettings).then(settings => {
      theme.set(settings.theme);
      showHidden.set(settings.showHidden);
      showCheckboxes.set(settings.showCheckboxes);
      viewType.set(settings.viewType);
    });
  }, []);

  useEffect(() => {
    invoke(Command.UpdateSettings, {
      key: SettingsKey.Theme,
      value: theme().toString()
    });
  }, [theme()]);

  useEffect(() => {
    invoke(Command.UpdateSettings, {
      key: SettingsKey.ShowHidden,
      value: showHidden() + ""
    });
  }, [showHidden()]);

  useEffect(() => {
    invoke(Command.UpdateSettings, {
      key: SettingsKey.ShowCheckboxes,
      value: showCheckboxes() + ""
    });
  }, [showCheckboxes()]);

  useEffect(() => {
    invoke(Command.UpdateSettings, { key: SettingsKey.ViewType, value: viewType() });
  }, [viewType()]);

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
    showCheckboxes,
    viewType
  };
});

export { SettingsProvider, useSettings };
