import ReactDOM from "react-dom/client";
import App from "./App";

import { EnvironmentProvider } from "@contexts/environment";
import { GlobalStatesProvider } from "@contexts/global-states";
import { loadSettings } from "@redux/settings-slice";
import { store } from "@redux/store";
import { Provider } from "react-redux";

import "./styles.css";

const main = () => {
  store.dispatch(loadSettings());

  return ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
      <GlobalStatesProvider>
        <EnvironmentProvider>
          <App />
        </EnvironmentProvider>
      </GlobalStatesProvider>
    </Provider>
  );
};

main();
