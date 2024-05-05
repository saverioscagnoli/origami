import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DirEntry } from "@typings/dir-entry";

type GlobalStatesSlice = {
  cutting: DirEntry[];
  copying: DirEntry[];
  renaming: DirEntry | null;
  error: string | null;
};

const globalStatesSlice = createSlice({
  name: "globalStates",
  initialState: {
    cutting: [],
    copying: [],
    renaming: null,
    error: null
  } as GlobalStatesSlice,
  reducers: {
    startCutting: (state, action: PayloadAction<DirEntry[]>) => {
      state.cutting = action.payload;
      state.copying = [];
    },

    startCopying: (state, action: PayloadAction<DirEntry[]>) => {
      state.copying = action.payload;
      state.cutting = [];
    },

    startRenaming: (state, action: PayloadAction<DirEntry>) => {
      state.renaming = action.payload;
    },

    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  }
});

export const { startCutting, startCopying, startRenaming, setError } =
  globalStatesSlice.actions;

export const globalStatesReducer = globalStatesSlice.reducer;

export type GlobalStatesState = ReturnType<typeof globalStatesReducer>;
