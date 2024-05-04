import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DirEntry } from "@typings/dir-entry";

type GlobalStatesSlice = {
  cutting: DirEntry[];
  copying: DirEntry[];
  renaming: DirEntry | null;
};

const globalStatesSlice = createSlice({
  name: "globalStates",
  initialState: {
    cutting: [],
    copying: [],
    renaming: null
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
    }
  }
});

export const { startCutting, startCopying, startRenaming } =
  globalStatesSlice.actions;

export const globalStatesReducer = globalStatesSlice.reducer;

export type GlobalStatesState = ReturnType<typeof globalStatesReducer>;
