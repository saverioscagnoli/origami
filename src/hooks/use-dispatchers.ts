import { useGlobalStates } from "@contexts/global-states";
import { OperationStatus, OperationType } from "@lib/operations";
import { pop, push, updateStatus } from "@redux/callstack-slice";
import {
  addSelected as dispatchAddSelected,
  removeSelected as dispatchRemoveSelected,
  replaceSelected as dispatchReplaceSelected,
  updateDir as dispatchUpdateDir,
  updateEntries as dispatchUpdateEntries
} from "@redux/current-dir-slice";
import { updateSettings as DispatchUpdateSettings } from "@redux/settings-slice";
import { DirEntry } from "@typings/dir-entry";
import { Settings } from "@typings/settings";
import { useDispatch } from "react-redux";
import { useCurrentDir } from "./use-current-dir";

function useDispatchers() {
  const { dir, selected } = useCurrentDir();
  const dispatch = useDispatch();

  /**
   * Updates the directory in the redux store.
   * @param newDir The new directory to update the redux store with
   */
  const updateDir = (newDir: string) => {
    dispatch(dispatchUpdateDir({ newDir }));
  };

  /**
   * Replaces the entries in the redux store.
   * @param entries The new entries to update the redux entries with
   */
  const updateEntries = (newEntries: DirEntry[]) => {
    dispatch(dispatchUpdateEntries({ entries: newEntries }));
  };

  /**
   * Function to request a directory listing for a given path.
   * This is used frequently to navigate to a new directory.
   * It returns a function to be called neatly in a component.
   * @param path The path to request the directory listing for
   * @returns A function that dispatches the request to list the directory
   */
  const cd = (path: string) => () => {
    if (path === dir) return;

    replaceSelected([]);

    dispatch(
      push({
        type: OperationType.ListDir,
        args: { path }
      })
    );
  };

  /**
   * Reloads the current directory by requesting a directory listing
   */
  const reload = () => {
    dispatch(
      push({
        type: OperationType.ListDir,
        args: { path: dir }
      })
    );
  };

  const open = (path: string) => () => {
    dispatch(
      push({
        type: OperationType.OpenFile,
        args: { path }
      })
    );
  };

  const { cutting, copying } = useGlobalStates();

  /**
   * Pastes the entry in the current directory.
   */
  const pasteEntries = () => {
    let paths: string[] = [];
    let isCutting = cutting().length > 0;
    let totalSize: number;

    if (isCutting) {
      paths = cutting().map(e => e.path);
      totalSize = cutting()
        .map(e => e.size)
        .reduce((a, b) => a + b, 0);
    } else {
      paths = copying().map(e => e.path);
      totalSize = copying()
        .map(e => e.size)
        .reduce((a, b) => a + b, 0);
    }

    dispatch(
      push({
        type: OperationType.PasteEntries,
        args: { paths, dir, isCutting, totalSize }
      })
    );

    copying.set([]);
    cutting.set([]);
  };

  /**
   * Renames an entry in the current directory.
   * @param oldPath The old path of the entry to rename
   * @param newPath The new path of the entry to rename
   */
  const renameEntry = (oldPath: string, newName: string) => {
    dispatch(
      push({
        type: OperationType.RenameEntry,
        args: { oldPath, newName }
      })
    );
  }

  /**
   * Deletes the selected entries in the current directory.
   */
  const deleteEntries = () => {
    dispatch(
      push({
        type: OperationType.DeleteEntries,
        args: { paths: selected.map(e => e.path) }
      })
    );
  };

  /**
   * Creates a folder or file in the given path.
   * @param path The path of the entry to create
   * @param isDir Whether the entry to create is a directory or not
   */
  const createEntry = (path: string, isDir: boolean) => {
    dispatch(
      push({
        type: OperationType.CreateEntry,
        args: { path, isDir }
      })
    );
  };

  /**
   *  Updates the status of an operation in the callstack.
   *  I.e from "Pending" to "Success"
   * @param id The id of the operation to update
   * @param status the new status of the operation
   */
  const updateOpStatus = (id: string, status: OperationStatus) => {
    dispatch(updateStatus({ id, status }));
  };

  /**
   * Removes an operation from the callstack given its id.
   * If the operation is not found, nothing happens.
   * @param id The id of the operation to remove from the callstack
   */
  const popOp = (id: string) => {
    dispatch(pop({ id }));
  };

  /**
   * Replaces the selected entries in the redux store.
   * @param newSelected the entries to replace the current state with.
   */
  const replaceSelected = (newSelected: DirEntry[]) => {
    dispatch(dispatchReplaceSelected({ newSelected }));
  };

  /**
   * Adds an entry to the selected entries in the redux store.
   * @param entry the entry to add to the selected entries
   */
  const addSelected = (entry: DirEntry) => {
    dispatch(
      dispatchAddSelected({
        entry
      })
    );
  };

  /**
   * Removes an entry from the selected entries in the redux store.
   * @param entry the entry to remove from the selected entries
   */
  const removeSelected = (entry: DirEntry) => {
    dispatch(
      dispatchRemoveSelected({
        entry
      })
    );
  };

  /**
   * Replaces the current settings with the new settings.
   * Any number of settings can be updated at once.
   * @param settings The new settings
   */
  const updateSettings = (settings: Partial<Settings>) => {
    dispatch(DispatchUpdateSettings(settings));
  };

  return {
    updateDir,
    updateEntries,
    cd,
    reload,
    open,
    pasteEntries,
    createEntry,
    renameEntry,
    deleteEntries,
    updateOpStatus,
    popOp,
    replaceSelected,
    addSelected,
    removeSelected,
    updateSettings
  };
}

export { useDispatchers };
