/* @refresh reload */
import { render } from "solid-js/web";
import App from "./App";

import { CurrentDirProvider } from "@contexts/current-dir";

import "./styles.css";

render(
  () => (
    <CurrentDirProvider>
      <App />
    </CurrentDirProvider>
  ),
  document.getElementById("root") as HTMLElement
);
