import { SettingsContext, Theme } from "@contexts/settings";
import { useAccessor } from "@hooks/use-accessor";
import { createContextProvider } from "@lib/utils";
import { useEffect } from "react";

const SettingsProvider = createContextProvider(SettingsContext, () => {
  const theme = useAccessor<Theme>("system");
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

  return { theme, showHidden, showCheckboxes };
});

export { SettingsProvider };
