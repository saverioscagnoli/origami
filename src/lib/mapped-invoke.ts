import { invoke as defaultInvoke } from "@tauri-apps/api/core";
import { getCurrent } from "@tauri-apps/api/window";
import { DirEntry } from "@typings/dir-entry";
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

  /**
   * Adds entries to starred list.
   * @param paths - Paths to star
   */
  [CommandName.StarEntries]: { paths: string[] };

  /**
   * Removes entries from starred list.
   * @param paths - Paths to unstar
   */
  [CommandName.UnstarEntries]: { paths: string[] };

  /**
   * Get image base64
   * @param path - Path to image
   */
  [CommandName.GetImageBase64]: { path: string };

  /**
   * Filter entries
   * @param entries - Entries to filter
   * @param query - Filter query
   */
  [CommandName.FilterEnties]: { entries: DirEntry[]; query: string };

  /**
   * Build index
   */
  [CommandName.BuildIndex]: null;

  /**
   * Search everywhere
   * @param query - Search query
   */
  [CommandName.SearchEverywhere]: { query: string };

  /**
   * Watch disk changes
   */
  [CommandName.WatchDiskChanges]: null;

  /**
   * Load css modules
   */
  [CommandName.LoadCSSModules]: null;
};

async function invoke<K extends CommandName>(command: K, args?: CommandArgsMap[K]) {
  const { label } = getCurrent();

  return defaultInvoke(command, { ...args, label });
}

export { invoke };
export type { CommandArgsMap };
