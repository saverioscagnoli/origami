import { configureStore } from "@reduxjs/toolkit";
import { currentDirReducer } from "./current-dir-slice";
import { environmentReducer } from "./environment-slice";
import { globalStatesReducer } from "./global-states-slice";
import { settingsReducer } from "./settings-slice";

const store = configureStore({
  reducer: {
    currentDir: currentDirReducer,
    settings: settingsReducer,
    environment: environmentReducer,
    globalStates: globalStatesReducer
  }
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
