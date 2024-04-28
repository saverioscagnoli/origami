import ReactDOM from "react-dom/client";
import App from "./App";
import { Callstack } from "@lib/callstack";
import { CurrentDirProvider } from "@contexts/current-dir";
import { SettingsProvider } from "@contexts/settings";

import "./styles.css";
import { NavigationProvider } from "@contexts/navigation";
import { GlobalStatesProvider } from "@contexts/global-states";

const operations = Callstack.build();

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

export { operations };
