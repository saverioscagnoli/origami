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
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const useNavigation = createContextHook(NavigationContext, "Navigation");

const NavigationProvider = createContextProvider(NavigationContext, () => {
  const { dir } = useCurrentDir();

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

  return {
    cd: path => () => {
      operations.push(OperationType.ListDir, { path });
    },
    reload: () => {
      operations.push(OperationType.ListDir, { path: dir() });
    },
    openFiles: paths => () => {
      for (const path of paths) {
        operations.push(OperationType.OpenFile, { path });
      }
    }
  };
});

export { useNavigation, NavigationProvider };
