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

  [Command.LoadSettings]: { args: {}; returns: Settings };
  [Command.UpdateSettings]: {
    args: { key: keyof Settings; value: string };
    returns: void;
  };
};

async function invoke<K extends Command>(command: K, args?: InvokeMap[K]["args"]) {
  return await defaultInvoke<InvokeMap[K]["returns"]>(command, args);
}

export { invoke };
