import { invoke as defaultInvoke } from "@tauri-apps/api/core";
import { CommandName } from "@typings/enums";

type CommandArgsMap = {
  /**
   * List directory
   * @param dir - Directory to list
   */
  [CommandName.ListDir]: { dir: string };

  /**
   * Poll disks
   */
  [CommandName.PollDisks]: null;

  /**
   * Create entry
   * @param path - Path to create
   * @param isDir - Is directory
   */
  [CommandName.CreateEntry]: { path: string; isDir: boolean };

  /**
   * Delete entries
   * @param paths - Paths to delete
   */
  [CommandName.DeleteEntries]: { paths: string[] };

  /**
   * Renames an entry IN THE CURRENT DIRECTORY
   * @param oldPath - Old path
   * @param newName - New name
   */
  [CommandName.RenameEntry]: { oldPath: string; newName: string };

  /**
   * Open files
   * @param paths - Paths to open
   */
  [CommandName.OpenFiles]: { paths: string[] };

  /**
   * Paste entries
   * @param paths - Paths to paste
   * @param dest - Destination path
   * @param cut - Whether the entries were cut
   */
  [CommandName.PasteEntries]: { paths: string[]; dest: string; cut: boolean };

  /**
   * Spawns another window.
   * No args needed
   */
  [CommandName.SpawnMainWindow]: null;

  /**
   * Closes all windows and exits the app.
   * No args needed.
   */
  [CommandName.CloseAllWindows]: null;
};

async function invoke<K extends CommandName>(
  command: K,
  args?: CommandArgsMap[K] & { id: number }
) {
  return defaultInvoke(command, args);
}

export { invoke };
export type { CommandArgsMap };
