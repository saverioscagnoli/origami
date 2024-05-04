import { CurrentDirState, updateDir, updateEntries } from "@redux/current-dir-slice";
import { RootState } from "@redux/store";
import { DirEntry } from "@typings/dir-entry";
import { useDispatch, useSelector } from "react-redux";

import {
  addSelected as distpatchAddSelected,
  removeSelected as distpatchRemoveSelected,
  replaceSelected as distpatchReplaceSelected
} from "@redux/current-dir-slice";
import { invoke } from "@tauri-apps/api/core";
import { Command } from "@typings/enums";

function useCurrentDir() {
  const currentDir = useSelector<RootState, CurrentDirState>(
    state => state.currentDir
  );

  const dispatch = useDispatch();

  /**
   * Add an entry to the selected list in the redux store
   * @param entry The entry to add to the selected list
   */
  const addSelected = (entry: DirEntry) => {
    dispatch(distpatchAddSelected({ entry }));
  };

  /**
   * Remove an entry from the selected list in the redux store
   * @param entry The entry to remove from the selected list
   */
  const removeSelected = (entry: DirEntry) => {
    dispatch(distpatchRemoveSelected({ entry }));
  };

  /**
   * Replace the selected list in the redux store with a new list
   * @param newSelected The new list of selected entries
   */
  const replaceSelected = (newSelected: DirEntry[]) => {
    dispatch(distpatchReplaceSelected({ newSelected }));
  };

  /**
   * A function to request a directory change from the backend
   * @param path The path to change the current directory to
   */
  const cd = async (path: string) => {
    if (path !== currentDir.dir) {
      const res = await invoke(Command.ListDir, { path });

      dispatch(updateEntries({ entries: res as DirEntry[] }));
      dispatch(updateDir({ newDir: path }));
    }
  };

  /**
   * Reload the current directory
   */
  const reload = async () => {
    const res = await invoke(Command.ListDir, { path: currentDir.dir });

    dispatch(updateEntries({ entries: res as DirEntry[] }));
  };

  return { ...currentDir, addSelected, removeSelected, replaceSelected, cd, reload };
}

export { useCurrentDir };
