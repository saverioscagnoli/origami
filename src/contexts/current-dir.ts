import { useAccessor } from "@hooks/use-accessor";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { OperationStatus, OperationType } from "@lib/operations";
import { createContextHook, createContextProvider } from "@lib/utils";
import { invoke } from "@tauri-apps/api/core";
import { emit } from "@tauri-apps/api/event";
import { Accessor } from "@typings/accessor";
import { Command } from "@typings/command";
import { DirEntry } from "@typings/dir-entry";
import { operations } from "main";
import { createContext, useEffect } from "react";

type CurrentDirContextValue = {
  dir: Accessor<string>;
  entries: Accessor<DirEntry[]>;
  selected: Accessor<DirEntry[]>;
};

const CurrentDirContext = createContext<CurrentDirContextValue | null>(null);

const useCurrentDir = createContextHook(CurrentDirContext, "CurrentDir");

const CurrentDirProvider = createContextProvider(CurrentDirContext, () => {
  const dir = useAccessor<string>("");
  const entries = useAccessor<DirEntry[]>([]);
  const selected = useAccessor<DirEntry[]>([]);

  useTauriEvent(
    OperationType.ListDir,
    payload => {
      const { opId, data, error, isFinished } = payload;

      if (error) {
        alert(error);
        operations.updateStatus(opId, OperationStatus.Error);
        return;
      }

      if (!data) {
        throw new Error("Not implemented");
      }

      entries.set(data.entries);

      if (isFinished) {
        operations.updateStatus(opId, OperationStatus.Success);
        emit("dir_changed", { oldPath: dir(), newPath: data.path });
        dir.set(data.path);
      }
    },
    [dir()]
  );

  return { dir, entries, selected };
});

export { useCurrentDir, CurrentDirProvider };
