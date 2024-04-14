import ReactDOM from "react-dom/client";
import App from "./App";
import { SettingsProvider } from "@providers/settings";
import { CurrentDirProvider } from "@providers/current-dir";
import { NavigationProvider } from "@providers/navigation";
import { GlobalStatesProvider } from "@providers/global-states";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SettingsProvider>
    <CurrentDirProvider>
      <NavigationProvider>
        <GlobalStatesProvider>
          <App />
        </GlobalStatesProvider>
      </NavigationProvider>
    </CurrentDirProvider>
  </SettingsProvider>
);
