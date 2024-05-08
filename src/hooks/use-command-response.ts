import { listen } from "@tauri-apps/api/event";
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
  error: Error | null,

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
    const promise = listen<CommandPayloadMap[K]>(command, event =>
      cb(event.payload)
    );

    return () => {
      promise.then(dispose => dispose());
    };
  }, deps);
}

export { useCommandResponse };
