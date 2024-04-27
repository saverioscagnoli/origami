import ReactDOM from "react-dom/client";
import App from "./App";
import { Callstack } from "@lib/callstack";
import { CurrentDirProvider } from "@contexts/current-dir";
import { SettingsProvider } from "@contexts/settings";

import "./styles.css";
import { NavigationProvider } from "@contexts/navigation";

const operations = Callstack.build();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <SettingsProvider>
    <CurrentDirProvider>
      <NavigationProvider>
        <App />
      </NavigationProvider>
    </CurrentDirProvider>
  </SettingsProvider>
);

export { operations };
