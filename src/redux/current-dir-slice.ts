import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DirEntry } from "@typings/dir-entry";

type CurrentDirSliceState = {
  dir: string;
  entries: DirEntry[];
  selected: DirEntry[];
};

const currentDirSlice = createSlice({
  name: "currentDir",
  initialState: { dir: "", entries: [], selected: [] } as CurrentDirSliceState,
  reducers: {
    updateDir: (state, action: PayloadAction<{ newDir: string }>) => {
      state.dir = action.payload.newDir;
    },

    updateEntries: (state, action: PayloadAction<{ entries: DirEntry[] }>) => {
      state.entries = action.payload.entries;
    },

    replaceSelected: (state, action: PayloadAction<{ newSelected: DirEntry[] }>) => {
      state.selected = action.payload.newSelected;
    },

    addSelected: (state, action: PayloadAction<{ entry: DirEntry }>) => {
      state.selected.push(action.payload.entry);
    },

    removeSelected: (state, action: PayloadAction<{ entry: DirEntry }>) => {
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

export type CurrentDirState = ReturnType<typeof currentDirReducer>;