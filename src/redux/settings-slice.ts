import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@typings/command";
import { Settings } from "@typings/settings";

const loadSettings = createAsyncThunk("settings/load", async () => {
  return await invoke<Settings>(Command.LoadSettings);
});

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: "dark",
    showHidden: false,
    showCheckboxes: true,
    viewType: "list"
  } as Settings,
  reducers: {
    load: (state, action: PayloadAction<Settings>) => {
      state.theme = action.payload.theme;
      state.showHidden = action.payload.showHidden;
      state.showCheckboxes = action.payload.showCheckboxes;
      state.viewType = action.payload.viewType;
    },

    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      // Stupid typescript complains if i do a for loop
      // Why does this language even exist

      const { theme, showHidden, showCheckboxes, viewType } = action.payload;

      if (theme !== undefined) {
        state.theme = theme;
        invoke(Command.UpdateSettings, { key: "theme", value: theme });
      }

      if (showHidden !== undefined) {
        state.showHidden = showHidden;
        invoke(Command.UpdateSettings, {
          key: "showHidden",
          value: `${showHidden}`
        });
      }

      if (showCheckboxes !== undefined) {
        state.showCheckboxes = showCheckboxes;
        invoke(Command.UpdateSettings, {
          key: "showCheckboxes",
          value: `${showCheckboxes}`
        });
      }

      if (viewType !== undefined) {
        state.viewType = viewType;
        invoke(Command.UpdateSettings, { key: "viewType", value: viewType });
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(loadSettings.fulfilled, (state, action) => {
      state.theme = action.payload.theme;
      state.showHidden = action.payload.showHidden;
      state.showCheckboxes = action.payload.showCheckboxes;
      state.viewType = action.payload.viewType;
    });
  }
});

export { loadSettings };
export const settingsReducer = settingsSlice.reducer;
export const { load, updateSettings } = settingsSlice.actions;
