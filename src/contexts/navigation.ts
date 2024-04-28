import { createContextHook, createContextProvider } from "@lib/utils";
import { createContext } from "react";
import { useCurrentDir } from "./current-dir";
import { operations } from "main";
import { OperationStatus, OperationType } from "@lib/operations";
import { useTauriEvent } from "@hooks/use-tauri-event";

type NavigationContextValue = {
  cd: (path: string) => () => void;
  reload: () => void;
  openFiles: (paths: string[]) => () => void;
  deleteEntries: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const useNavigation = createContextHook(NavigationContext, "Navigation");

const NavigationProvider = createContextProvider(NavigationContext, () => {
  const { dir, selected } = useCurrentDir();

  const cd = (path: string) => () => {
    operations.push(OperationType.ListDir, { path });
  };

  const reload = () => {
    operations.push(OperationType.ListDir, { path: dir() });
  };

  const openFiles = (paths: string[]) => () => {
    for (const path of paths) {
      operations.push(OperationType.OpenFile, { path });
    }
  };

  useTauriEvent(OperationType.OpenFile, payload => {
    const { opId, data, error, isFinished } = payload;

    if (error) {
      operations.updateStatus(opId, OperationStatus.Error);
      alert(error);
    }

    if (!data) {
      throw new Error("Not implemented");
    }

    if (isFinished) {
      operations.updateStatus(opId, OperationStatus.Success);
    }
  });

  useTauriEvent(
    "watch",
    () => {
      reload();
    },
    [dir()]
  );

  const deleteEntries = () => {
    for (const { path } of selected()) {
      operations.push(OperationType.DeleteEntry, { path });
    }
  };

  useTauriEvent(OperationType.DeleteEntry, payload => {
    const { opId, data, error, isFinished } = payload;

    if (error) {
      operations.updateStatus(opId, OperationStatus.Error);
      alert(error);
    }

    if (!data) {
      throw new Error("Not implemented");
    }

    console.log(data);

    if (isFinished) {
      operations.updateStatus(opId, OperationStatus.Success);
    }
  });

  return { cd, reload, openFiles, deleteEntries };
});

export { useNavigation, NavigationProvider };
