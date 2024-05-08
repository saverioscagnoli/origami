/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { CallstackProvider } from "@contexts/callstack";
import { CurrentDirProvider } from "@contexts/current-dir";

import "./styles.css";

render(
  () => (
    <CallstackProvider>
      <CurrentDirProvider>
        <App />
      </CurrentDirProvider>
    </CallstackProvider>
  ),
  document.getElementById("root") as HTMLElement
);
