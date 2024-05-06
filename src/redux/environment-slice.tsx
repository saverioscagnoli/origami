import { invoke } from "@lib/mapped-invoke";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  appConfigDir,
  desktopDir,
  documentDir,
  downloadDir,
  homeDir,
  pictureDir,
  sep
} from "@tauri-apps/api/path";
import { BasicDirLabel, Command } from "@typings/enums";

type BasicDir = {
  path: string;
  icon: string;
  label: BasicDirLabel;
};

type EnvironmentSliceState = {
  basicDirs: BasicDir[];
  isVscodeInstalled: boolean;
  isWindowsTerminalInstalled?: boolean;
};

const resolveBasicDirs = createAsyncThunk(
  "environment/resolveBasicDirs",
  async () => {
    const basicDirs: BasicDir[] = [];

    const promises = [
      appConfigDir(),
      homeDir(),
      desktopDir(),
      downloadDir(),
      documentDir(),
      pictureDir()
    ];

    const icons = [
      "StarFilledIcon",
      "HomeIcon",
      "DesktopIcon",
      "DownloadIcon",
      "ReaderIcon",
      "ImageIcon"
    ];

    const labels = [
      BasicDirLabel.Starred,
      BasicDirLabel.Home,
      BasicDirLabel.Desktop,
      BasicDirLabel.Downloads,
      BasicDirLabel.Documents,
      BasicDirLabel.Pictures
    ];

    for (let i = 0; i < promises.length; i++) {
      const promise = promises[i];

      try {
        let path = await promise;
        const icon = icons[i];
        const label = labels[i];

        if (i === 0) {
          path += sep() + "Starred";
        }

        basicDirs.push({ path, icon, label });
      } catch {
        console.warn("Failed to resolve one of the basic directories.");
      }
    }

    return basicDirs;
  }
);

const loadEnvironment = createAsyncThunk("environment/loadEnvironment", async () => {
  return await invoke(Command.LoadEnvironment);
});

const environmentSlice = createSlice({
  name: "environment",
  initialState: { basicDirs: [], isVscodeInstalled: false } as EnvironmentSliceState,
  reducers: {},
  extraReducers: builder => {
    builder.addCase(resolveBasicDirs.fulfilled, (state, action) => {
      state.basicDirs = action.payload;
    });

    builder.addCase(loadEnvironment.fulfilled, (state, action) => {
      state.isVscodeInstalled = action.payload.isVscodeInstalled;
      state.isWindowsTerminalInstalled =
        action.payload.isWindowsTerminalInstalled ?? null;
    });
  }
});

export { loadEnvironment, resolveBasicDirs };
export const environmentReducer = environmentSlice.reducer;

export type EnvironmentState = ReturnType<typeof environmentReducer>;
