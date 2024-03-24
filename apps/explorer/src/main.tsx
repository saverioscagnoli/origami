import ReactDOM from "react-dom/client";
import App from "./App";
import { ThemeProvider } from "@providers/theme";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
