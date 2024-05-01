import { createSlice } from "@reduxjs/toolkit";
import { DirEntry } from "@typings/dir-entry";
import { Action } from "./store";

type CurrentDirSliceState = {
  dir: string;
  entries: DirEntry[];
  selected: DirEntry[];
};

const currentDirSlice = createSlice({
  name: "currentDir",
  initialState: { dir: "", entries: [], selected: [] } as CurrentDirSliceState,
  reducers: {
    updateDir: (state, action: Action<{ newDir: string }>) => {
      state.dir = action.payload.newDir;
    },

    updateEntries: (state, action: Action<{ entries: DirEntry[] }>) => {
      state.entries = action.payload.entries;
    },

    replaceSelected: (state, action: Action<{ newSelected: DirEntry[] }>) => {
      state.selected = action.payload.newSelected;
    },

    addSelected: (state, action: Action<{ entry: DirEntry }>) => {
      state.selected.push(action.payload.entry);
    },

    removeSelected: (state, action: Action<{ entry: DirEntry }>) => {
      const index = state.selected.findIndex(
        entry => entry.path === action.payload.entry.path
      );

      if (index !== -1) {
        state.selected.splice(index, 1);
      }
    }
  }
});

export const {
  updateDir,
  updateEntries,
  replaceSelected,
  addSelected,
  removeSelected
} = currentDirSlice.actions;

export const currentDirReducer = currentDirSlice.reducer;
