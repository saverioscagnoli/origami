import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DirEntry } from "@typings/dir-entry";

type GlobalStatesSlice = {
  cutting: DirEntry[];
  copying: DirEntry[];
  renaming: DirEntry | null;
  errors: string[] | null;
  creating: { state: boolean; isDir: boolean } | null;
  searching: { state: boolean; where: "here" | "everywhere"; query: string };
};

const globalStatesSlice = createSlice({
  name: "globalStates",
  initialState: {
    cutting: [],
    copying: [],
    renaming: null,
    errors: null,
    creating: null,
    searching: { state: false, where: "here", query: "" }
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
    },

    setSearching: (
      state,
      action: PayloadAction<{
        state: boolean;
        where: "here" | "everywhere";
        query: string;
      }>
    ) => {
      state.searching = action.payload;
    }
  }
});

export const {
  startCutting,
  startCopying,
  startRenaming,
  setErrors,
  setCreating,
  setSearching
} = globalStatesSlice.actions;

export const globalStatesReducer = globalStatesSlice.reducer;

export type GlobalStatesState = ReturnType<typeof globalStatesReducer>;
