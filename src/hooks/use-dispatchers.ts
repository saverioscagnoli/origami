import { useDispatch } from "react-redux";
import { useCurrentDir } from "./use-current-dir";
import { pop, push, updateStatus } from "@redux/callstack-slice";
import { OperationStatus, OperationType } from "@lib/operations";
import { useGlobalStates } from "@contexts/global-states";
import {
  updateDir as dispatchUpdateDir,
  updateEntries as dispatchUpdateEntries
} from "@redux/current-dir-slice";
import { DirEntry } from "@typings/dir-entry";

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
    cd(dir)();
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

    if (isCutting) {
      paths = cutting().map(e => e.path);
    } else {
      paths = copying().map(e => e.path);
    }

    dispatch(
      push({
        type: OperationType.DeleteEntries,
        args: { paths: selected.map(e => e.path), dir, isCutting }
      })
    );
  };

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

  return {
    updateDir,
    updateEntries,
    cd,
    reload,
    open,
    pasteEntries,
    deleteEntries,
    updateOpStatus,
    popOp
  };
}

export { useDispatchers };
