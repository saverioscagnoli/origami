// Here are all the listeners that are concerned with any operation that is pushed to the callstack.

import { useBackendOperation } from "@hooks/use-backend-operation";
import { useDispatchers } from "@hooks/use-dispatchers";
import { OperationStatus, OperationType } from "./operations";

function currentDirListeners() {
  const { updateDir, updateEntries, updateOpStatus } = useDispatchers();

  useBackendOperation(OperationType.ListDir, payload => {
    const { opId, data, error, isFinished } = payload;

    if (error) {
      alert(error);
      updateOpStatus(opId, OperationStatus.Error);
      return;
    }

    if (isFinished) {
      updateOpStatus(opId, OperationStatus.Success);

      // Change the current directory and its entries on success.
      updateDir(data.path);
      updateEntries(data.entries);
    }
  });
}

export { currentDirListeners };
