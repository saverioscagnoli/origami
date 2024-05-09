import { CallstackWrapper } from "@zustand/callstack-store";
import ReactDOM from "react-dom/client";
import { App } from "./App";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <CallstackWrapper>
    <App />
  </CallstackWrapper>
);
