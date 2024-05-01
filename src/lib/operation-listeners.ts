// Here are all the listeners that are concerned with any operation that is pushed to the callstack.

import { useBackendOperation } from "@hooks/use-backend-operation";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { OperationStatus, OperationType } from "./operations";

function currentDirListeners() {
  const { updateDir, updateEntries, updateOpStatus, reload } = useDispatchers();
  const { dir } = useCurrentDir();

  useBackendOperation(OperationType.ListDir, payload => {
    const { opId, data, error, isFinished } = payload;

    if (error) {
      alert(error);
      updateOpStatus(opId, OperationStatus.Error);
      return;
    }

    if (data.entries.length !== 0 && !error) {
      const filtered = data.entries.sort((a, b) => {
        if (a.isDir && !b.isDir) return -1;
        if (!a.isDir && b.isDir) return 1;
        return a.name.localeCompare(b.name);
      });

      updateEntries(filtered);
    }

    if (isFinished) {
      updateOpStatus(opId, OperationStatus.Success);

      if (data.entries.length === 0) {
        updateEntries([]);
      }

      // Change the current directory and its entries on success.
      updateDir(data.path);
    }
  });

  useBackendOperation(
    OperationType.PasteEntries,
    payload => {
      const { opId, data, error, isFinished } = payload;

      if (error) {
        alert(error);
        updateOpStatus(opId, OperationStatus.Error);
        return;
      }

      if (data.dir === dir) {
        reload();
      }

      if (isFinished) {
        updateOpStatus(opId, OperationStatus.Success);
      }
    },
    [dir]
  );

  useBackendOperation(
    OperationType.DeleteEntries,
    payload => {
      const { opId, data, error, isFinished } = payload;

      if (error) {
        alert(error);
        updateOpStatus(opId, OperationStatus.Error);
        return;
      }

      if (isFinished) {
        updateOpStatus(opId, OperationStatus.Success);
        if (data.dir === dir) {
          reload();
        }
      }
    },
    [dir]
  );
}

export { currentDirListeners };
