import ReactDOM from "react-dom/client";
import { App } from "./App";
import { ThemeProvider } from "@providers/theme";
import { ConstantsProvider } from "@providers/constants";

import "./index.css";
import { CurrentDirProvider } from "@components/providers/current-dir";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <CurrentDirProvider>
      <ConstantsProvider>
        <App />
      </ConstantsProvider>
    </CurrentDirProvider>
  </ThemeProvider>
);
