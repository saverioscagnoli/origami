import { useAccessor } from "@hooks/use-accessor";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { OperationStatus, OperationType } from "@lib/operations";
import { createContextHook, createContextProvider } from "@lib/utils";
import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { operations } from "main";
import { createContext } from "react";

type CurrentDirContextValue = {
  dir: Accessor<string>;
  entries: Accessor<DirEntry[]>;
  selected: Accessor<DirEntry[]>;
};

const CurrentDirContext = createContext<CurrentDirContextValue | null>(null);

const useCurrentDir = createContextHook(CurrentDirContext, "CurrentDir");

const CurrentDirProvider = createContextProvider(CurrentDirContext, () => {
  const dir = useAccessor<string>("/");
  const entries = useAccessor<DirEntry[]>([]);
  const selected = useAccessor<DirEntry[]>([]);

  useTauriEvent(OperationType.ListDir, payload => {
    const { opId, data, error, isFinished } = payload;

    if (error) {
      alert(error);
      operations.updateStatus(opId, OperationStatus.Error);
      return;
    }

    if (!data) {
      throw new Error("Not implemented");
    }

    dir.set(data.path);
    entries.set(data.entries);

    console.log(isFinished)

    if (isFinished) {
      operations.updateStatus(opId, OperationStatus.Success);
    }
  });

  return { dir, entries, selected };
});

export { useCurrentDir, CurrentDirProvider };
