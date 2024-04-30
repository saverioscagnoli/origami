import { configureStore } from "@reduxjs/toolkit";
import { callstackReducer } from "./callstack-slice";
import { currentDirReducer } from "./current-dir-slice";

type Action<T> = {
  payload: T;
  type: string;
};

const store = configureStore({
  reducer: {
    callstack: callstackReducer,
    currentDir: currentDirReducer
  }
});

export { store };
export type RootState = ReturnType<typeof store.getState>;
export type { Action };
