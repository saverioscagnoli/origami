import { invoke } from "@lib/mapped-invoke";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Command } from "@typings/enums";
import { Settings } from "@typings/settings";

const loadSettings = createAsyncThunk("settings/load", async () => {
  return await invoke(Command.LoadSettings);
});

const settingsSlice = createSlice({
  name: "settings",
  initialState: {
    theme: "system",
    view: "list",
    showCheckboxes: false,
    showHidden: false
  } as Settings,
  reducers: {
    updateSettings: (state, action: PayloadAction<Partial<Settings>>) => {
      // Stupid typescript complains if i do a for loop
      // Why does this language even exist

      const { theme, view, showCheckboxes, showHidden } = action.payload;

      if (theme) {
        state.theme = theme;
      }

      if (view) {
        state.view = view;
      }

      if (showCheckboxes !== undefined) {
        state.showCheckboxes = showCheckboxes;
      }

      if (showHidden !== undefined) {
        state.showHidden = showHidden;
      }
    }
  },
  extraReducers: builder => {
    builder.addCase(loadSettings.fulfilled, (state, action) => {
      Object.assign(state, action.payload);
    });
  }
});

export { loadSettings };

export const settingsReducer = settingsSlice.reducer;
export const { updateSettings } = settingsSlice.actions;

export type SettingsState = ReturnType<typeof settingsReducer>;

updateSettings({});
