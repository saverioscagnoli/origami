import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DirEntry } from "@typings/dir-entry";

type GlobalStatesSlice = {
  cutting: DirEntry[];
  copying: DirEntry[];
  renaming: DirEntry | null;
  errors: string[] | null;
  creating: { state: boolean; isDir: boolean } | null;
};

const globalStatesSlice = createSlice({
  name: "globalStates",
  initialState: {
    cutting: [],
    copying: [],
    renaming: null,
    errors: null,
    creating: null
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

    setErrors: (state, action: PayloadAction<string[]>) => {
      state.errors = action.payload;
    },

    setCreating: (
      state,
      action: PayloadAction<{ state: boolean; isDir: boolean }>
    ) => {
      state.creating = action.payload;
    }
  }
});

export const { startCutting, startCopying, startRenaming, setErrors, setCreating } =
  globalStatesSlice.actions;

export const globalStatesReducer = globalStatesSlice.reducer;

export type GlobalStatesState = ReturnType<typeof globalStatesReducer>;
