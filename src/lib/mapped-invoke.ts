import { EnvironmentState } from "@redux/environment-slice";
import { invoke as defaultInvoke } from "@tauri-apps/api/core";
import { DirEntry } from "@typings/dir-entry";
import { Command } from "@typings/enums";
import { Settings } from "@typings/settings";

type InvokeMap = {
  [Command.ListDir]: { args: { path: string }; returns: [DirEntry[], string] };
  [Command.PollDisks]: { args: {}; returns: void };
  [Command.OpenFiles]: { args: { paths: string[] }; returns: void };
  [Command.RenameEntry]: {
    args: { path: string; newName: string };
    returns: [string, string];
  };
  /**
   * Data for the delete entries command
   * @param paths The paths to delete
   * @returns A tuple containing the deleted paths and any errors
   */
  [Command.DeleteEntries]: {
    args: { paths: string[] };
    returns: [string[], string[]];
  };

  /**
   * Data for the create entry command
   * @param path The path to create the entry in
   * @param isDir Whether the entry is a directory
   * @returns A tuple containing the path of the created entry and any errors
   */
  [Command.CreateEntry]: {
    args: { path: string; isDir: boolean };
    returns: [string, string?];
  };

  /**
   * Data for the star entry command
   * @param path The path to the entry
   * @returns The new starred status of the entry
   */
  [Command.StarEntries]: { args: { paths: string[] }; returns: [string, string[]] };

  /**
   * Data for the unstar entry command
   * @param path The path to the entry
   * @returns The new starred status of the entry
   */
  [Command.UnstarEntries]: {
    args: { paths: string[] };
    returns: [string, string[]];
  };

  /**
   * Data for the paste entries command
   * @param paths The paths to paste
   * @param newDir The destination path
   * @param isCutting Whether the operation is a cut or copy
   * @returns A tuple containing the new paths and any errors
   */
  [Command.PasteEntries]: {
    args: { paths: string[]; newDir: string; isCutting: boolean };
    returns: [string[], string[]];
  };

  [Command.LoadSettings]: { args: {}; returns: Settings };
  [Command.UpdateSettings]: {
    args: { key: keyof Settings; value: string };
    returns: void;
  };

  /**
   * Data for the get image base64 command
   * @param path The path to the image
   * @returns The base64 encoded image
   */
  [Command.GetImageBase64]: { args: { path: string }; returns: string };

  /**
   * Data for the close window command
   * @param label The label of the window to close
   */
  [Command.CloseWindow]: { args: { label: string }; returns: void };

  /**
   * Creates a new main window
   */
  [Command.CreateWindow]: { args: null; returns: void };

  /**
   * Quits the app
   */
  [Command.CloseAllWindows]: { args: null; returns: void };

  /**
   * Loads the environment state,
   * such as if vscode is installed, terminal is available,
   * Downloads, Documents, etc.
   */
  [Command.LoadEnvironment]: { args: null; returns: EnvironmentState };

  /**
   * Opens a directory in vscode
   * @param dir The directory to open
   * @returns [value, error] where value is the directory opened.
   */
  [Command.OpenInVscode]: { args: { dir: string }; returns: [string?, string?] };

  /**
   * Opens a directory in windows terminal
   * @param dir The directory to open
   * @returns [value, error] where value is the directory opened.
   * (Windows only :3)
   */
  [Command.OpenInWindowsTerminal]: {
    args: { dir: string };
    returns: [string?, string?];
  };
};

async function invoke<K extends Command>(command: K, args?: InvokeMap[K]["args"]) {
  return await defaultInvoke<InvokeMap[K]["returns"]>(command, args);
}

export { invoke };
