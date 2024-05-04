import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Settings } from "@typings/settings";

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
  }
});

export const settingsReducer = settingsSlice.reducer;
export const { updateSettings } = settingsSlice.actions;

export type SettingsState = ReturnType<typeof settingsReducer>;

updateSettings({});
