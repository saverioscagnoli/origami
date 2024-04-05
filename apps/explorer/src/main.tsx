import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "@providers/theme";
import { ConstantsProvider } from "@providers/constants";
import { CurrentDirProvider } from "@providers/current-dir";
import { FlagsProvider } from "@providers/flags";
import { GlobalStatesProvider } from "@providers/global-states";
import { HistoryProvider } from "@providers/history";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <GlobalStatesProvider>
      <CurrentDirProvider>
        <HistoryProvider>
          <ConstantsProvider>
            <FlagsProvider>
              <App />
            </FlagsProvider>
          </ConstantsProvider>
        </HistoryProvider>
      </CurrentDirProvider>
    </GlobalStatesProvider>
  </ThemeProvider>
);
