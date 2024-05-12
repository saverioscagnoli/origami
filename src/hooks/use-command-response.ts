import { getCurrent } from "@tauri-apps/api/webview";
import { DirEntry } from "@typings/dir-entry";
import { CommandName } from "@typings/enums";
import { DependencyList, useEffect } from "react";

type BasePayload<T> = [
  /**
   * The id of the command (For removing in the callstack)
   */
  id: number,

  /**
   * The data the command is supposed to return, if not an error
   */
  data: T | null,

  /**
   * The error the command encountered, if any
   */
  error: string | null,

  /**
   * Whether the command is finished or not
   * For command that return data in chunks.
   */
  isFinished: boolean
];

type CommandPayloadMap = {
  /**
   * @param dir The listed directory
   * @param entries The entries in the directory
   */
  [CommandName.ListDir]: BasePayload<[dir: string, entries: DirEntry[]]>;

  /**
   * Starts polling the disks.
   * No data is returned, listener can be omitted.
   */
  [CommandName.PollDisks]: null;

  /**
   * @param path The path of the created entry
   * @param isDir Whether the entry is a directory or not
   *
   * @returns The created entry
   */
  [CommandName.CreateEntry]: BasePayload<DirEntry>;

  /**
   * @param paths The paths of the deleted entries
   *
   * Sends data in chunks.
   */
  [CommandName.DeleteEntries]: BasePayload<string>;

  /**
   * @param oldPath The old path of the renamed entry
   * @param newEntry The new entry
   */
  [CommandName.RenameEntry]: BasePayload<[oldPath: string, newEntry: DirEntry]>;

  /**
   * @param path The path of the opened file
   * (Sent in chunks)
   */
  [CommandName.OpenFiles]: BasePayload<string>;

  /**
   * @param entry the last pasted entry
   * (Sent in chunks)
   */
  [CommandName.PasteEntries]: BasePayload<DirEntry>;

  /**
   * Doesnt return anything.
   */
  [CommandName.SpawnMainWindow]: null;

  /**
   * Doesnt return anything.
   */
  [CommandName.CloseAllWindows]: null;

  /**
   * @param entry The starred entry
   * (Sent in chunks)
   */
  [CommandName.StarEntries]: BasePayload<DirEntry>;

  /**
   * @param entry The unstarred entry
   * (Sent in chunks)
   */
  [CommandName.UnstarEntries]: BasePayload<DirEntry>;

  /**
   * This command does not use the payload.
   */
  [CommandName.GetImageBase64]: null;

  /**
   * @param entries The filtered entries
   */
  [CommandName.FilterEnties]: BasePayload<DirEntry[]>;

  /**
   * This command does not use the payload.
   */
  [CommandName.BuildIndex]: null;

  /**
   * Returms the paths
   */
  [CommandName.SearchEverywhere]: BasePayload<DirEntry[]>;

  /**
   * This command does not use the payload.
   */
  [CommandName.WatchDiskChanges]: null;
};

/**
 * Function to create a listener to a command, and run a callback when data is received
 * @param command The command to listen to
 * @param cb What should happen when data is received
 */
function useCommandResponse<K extends CommandName>(
  command: K,
  cb: (payload: CommandPayloadMap[K]) => void,
  deps: DependencyList = []
) {
  useEffect(() => {
    const promise = getCurrent().listen<CommandPayloadMap[K]>(command, event =>
      cb(event.payload)
    );

    return () => {
      promise.then(dispose => dispose());
    };
  }, deps);
}

export { useCommandResponse };
