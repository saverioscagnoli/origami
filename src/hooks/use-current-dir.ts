import {
  CurrentDirState,
  updateEntries as dispatchUpdateEntries,
  updateDir
} from "@redux/current-dir-slice";
import { RootState } from "@redux/store";
import { DirEntry } from "@typings/dir-entry";
import { useDispatch, useSelector } from "react-redux";

import { invoke } from "@lib/mapped-invoke";
import {
  addSelected as distpatchAddSelected,
  removeSelected as distpatchRemoveSelected,
  replaceSelected as distpatchReplaceSelected
} from "@redux/current-dir-slice";
import { setSearching } from "@redux/global-states-slice";
import { sep } from "@tauri-apps/api/path";
import { Command } from "@typings/enums";
import { useGlobalStates } from "./use-global-states";

function useCurrentDir() {
  const currentDir = useSelector<RootState, CurrentDirState>(
    state => state.currentDir
  );

  const dispatch = useDispatch();
  const { setErrors } = useGlobalStates();

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
      const [entries, err] = await invoke(Command.ListDir, { path });

      if (err) {
        setErrors([err]);
        return;
      }

      setErrors(null);

      dispatch(setSearching({ state: false, query: "", where: "here" }));
      dispatch(dispatchUpdateEntries({ entries }));
      dispatch(updateDir({ newDir: path }));
      replaceSelected([]);
    }
  };

  /**
   * Reload the current directory
   */
  const reload = async () => {
    const [entries, err] = await invoke(Command.ListDir, { path: currentDir.dir });

    if (err) {
      setErrors([err]);
      return;
    }

    setErrors(null);

    dispatch(dispatchUpdateEntries({ entries }));
  };

  const updateEntries = (entries: DirEntry[]) => {
    dispatch(dispatchUpdateEntries({ entries }));
  };

  const openFiles = async (paths: string[]) => {
    await invoke(Command.OpenFiles, { paths });
  };

  const goToParent = () => {
    const parent = currentDir.dir.split(sep()).slice(0, -1).join(sep());

    if (parent === "") return;

    // If parent is a root directory, append a slash
    const parentWithSlash = parent.length === 2 ? parent + sep() : parent;

    cd(parentWithSlash);
  };

  return {
    ...currentDir,
    addSelected,
    removeSelected,
    replaceSelected,
    cd,
    reload,
    updateEntries,
    openFiles,
    goToParent
  };
}

export { useCurrentDir };
