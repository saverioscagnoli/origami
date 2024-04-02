import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "@providers/theme";
import { ConstantsProvider } from "@providers/constants";
import { CurrentDirProvider } from "@components/providers/current-dir";
import { FlagsProvider } from "@components/providers/flags";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <CurrentDirProvider>
      <ConstantsProvider>
        <FlagsProvider>
          <App />
        </FlagsProvider>
      </ConstantsProvider>
    </CurrentDirProvider>
  </ThemeProvider>
);
