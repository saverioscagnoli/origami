import ReactDOM from "react-dom/client";
import App from "./App";
import { SettingsProvider } from "@contexts/settings";

import "./styles.css";
import { GlobalStatesProvider } from "@contexts/global-states";
import { EnvironmentProvider } from "@contexts/environment";
import { configureStore, createSlice } from "@reduxjs/toolkit";
import { Operation, OperationType } from "@lib/operations";
import { Provider } from "react-redux";
import { store } from "@redux/store";
import { fetchHomeDir } from "@redux/current-dir-slice";

function main() {
  ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <SettingsProvider>
      <Provider store={store}>
        <GlobalStatesProvider>
          <EnvironmentProvider>
            <App />
          </EnvironmentProvider>
        </GlobalStatesProvider>
      </Provider>
    </SettingsProvider>
  );
}

main();
