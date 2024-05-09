import { CallstackWatcher } from "@zustand/callstack-store";
import { ThemeWatcher } from "@zustand/settings-store";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeWatcher>
    <CallstackWatcher>
      <App />
    </CallstackWatcher>
  </ThemeWatcher>
);
