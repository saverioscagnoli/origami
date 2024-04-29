import ReactDOM from "react-dom/client";
import App from "./App";
import { CurrentDirProvider } from "@contexts/current-dir";
import { SettingsProvider } from "@contexts/settings";

import "./styles.css";
import { NavigationProvider } from "@contexts/navigation";
import { GlobalStatesProvider } from "@contexts/global-states";
import { EnvironmentProvider } from "@contexts/environment";
import { CallstackProvider } from "@contexts/callstack";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SettingsProvider>
    <CallstackProvider>
      <CurrentDirProvider>
        <GlobalStatesProvider>
          <NavigationProvider>
            <EnvironmentProvider>
              <App />
            </EnvironmentProvider>
          </NavigationProvider>
        </GlobalStatesProvider>
      </CurrentDirProvider>
    </CallstackProvider>
  </SettingsProvider>
);
