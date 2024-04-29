import { createContextHook, createContextProvider } from "@lib/utils";
import { createContext } from "react";
import { useCurrentDir } from "./current-dir";
import { OperationStatus, OperationType } from "@lib/operations";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { useGlobalStates } from "./global-states";
import { Callstack } from "@lib/callstack";
import { useCallstack } from "./callstack";

type NavigationContextValue = {
  cd: (path: string) => () => void;
  reload: () => void;
  openFiles: (paths: string[]) => () => void;
  cutEntries: () => void;
  copyEntries: () => void;
  pasteEntries: () => void;
  deleteEntries: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

const useNavigation = createContextHook(NavigationContext, "Navigation");

const NavigationProvider = createContextProvider(NavigationContext, () => {
  const { dir, selected } = useCurrentDir();
  const callstack = useCallstack();

  const cd = (path: string) => () => {
    if (path !== dir()) {
      callstack.push(OperationType.ListDir, { path });
    }
  };

  const reload = () => {
    callstack.push(OperationType.ListDir, { path: dir() });
  };

  const openFiles = (paths: string[]) => () => {
    for (const path of paths) {
      callstack.push(OperationType.OpenFile, { path });
    }
  };

  useTauriEvent(OperationType.OpenFile, payload => {
    const { opId, data, error, isFinished } = payload;

    if (error) {
      callstack.updateStatus(opId, OperationStatus.Error);
      alert(error);
    }

    if (!data) {
      throw new Error("Not implemented");
    }

    if (isFinished) {
      callstack.updateStatus(opId, OperationStatus.Success);
    }
  });

  const shouldBlock = [OperationType.DeleteEntry, OperationType.PasteEntries];

  useTauriEvent(
    "watch",
    () => {
      const blocked = callstack
        .getPendingOperations()
        ?.some(op => shouldBlock.includes(op.getType()));

      if (!blocked) {
        reload();
      }
    },
    [dir()]
  );

  const { cutting, copying } = useGlobalStates();

  const cutEntries = () => {
    cutting.set(selected());
    copying.reset();
  };

  const copyEntries = () => {
    copying.set(selected());
    cutting.reset();
  };

  const pasteEntries = () => {
    if (cutting().length > 0) {
      const paths = cutting().map(e => e.path);
      callstack.push(OperationType.PasteEntries, {
        paths,
        dir: dir(),
        isCutting: true
      });
    } else {
      const paths = copying().map(e => e.path);
      callstack.push(OperationType.PasteEntries, {
        paths,
        dir: dir(),
        isCutting: false
      });
    }

    cutting.reset();
    copying.reset();
  };

  useTauriEvent(
    OperationType.PasteEntries,
    payload => {
      const { opId, error, isFinished } = payload;

      if (error) {
        callstack.updateStatus(opId, OperationStatus.Error);
        alert(error);
      }

      if (isFinished) {
        reload();
        callstack.updateStatus(opId, OperationStatus.Success);
      }
    },
    [dir()]
  );

  const deleteEntries = () => {
    for (const { path } of selected()) {
      callstack.push(OperationType.DeleteEntry, { path });
    }
  };

  useTauriEvent(
    OperationType.DeleteEntry,
    payload => {
      const { opId, data, error, isFinished } = payload;

      if (error) {
        callstack.updateStatus(opId, OperationStatus.Error);
        alert(error);
      }

      if (!data) {
        throw new Error("Not implemented");
      }

      if (isFinished) {
        reload();
        callstack.updateStatus(opId, OperationStatus.Success);
      }
    },
    [dir()]
  );

  return {
    cd,
    reload,
    openFiles,
    deleteEntries,
    cutEntries,
    copyEntries,
    pasteEntries
  };
});

export { useNavigation, NavigationProvider };
