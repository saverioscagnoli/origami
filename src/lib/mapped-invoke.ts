import { invoke as defaultInvoke } from "@tauri-apps/api/core";
import { DirEntry } from "@typings/dir-entry";
import { Command } from "@typings/enums";

type InvokeMap = {
  [Command.ListDir]: { args: { path: string }; returns: DirEntry[] };
  [Command.PollDisks]: { args: {}; returns: void };
  [Command.OpenFiles]: { args: { paths: string[] }; returns: void };
  [Command.RenameEntry]: { args: { path: string; newName: string }; returns: void };
};

async function invoke<K extends Command>(command: K, args?: InvokeMap[K]["args"]) {
  return await defaultInvoke<InvokeMap[K]["returns"]>(command, args);
}

export { invoke };
