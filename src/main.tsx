import ReactDOM from "react-dom/client";

import { resolveBasicDirs } from "@redux/environment-slice";
import { loadSettings } from "@redux/settings-slice";
import { store } from "@redux/store";
import App from "App";
import { Provider } from "react-redux";
import "./styles.css";

const main = async () => {
  store.dispatch(resolveBasicDirs());
  store.dispatch(loadSettings());

  return ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
    <Provider store={store}>
      <App />
    </Provider>
  );
};

main();
