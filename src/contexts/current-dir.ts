import { useAccessor } from "@hooks/use-accessor";
import { useTauriEvent } from "@hooks/use-tauri-event";
import { Callstack } from "@lib/callstack";
import { OperationStatus, OperationType } from "@lib/operations";
import { createContextHook, createContextProvider } from "@lib/utils";
import { emit } from "@tauri-apps/api/event";
import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { EventToBackend } from "@typings/events";
import { createContext, useEffect } from "react";
import { useCallstack } from "./callstack";

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

  // Reset selected entries every time the user changes the directory.
  useEffect(() => {
    selected.reset();
  }, [dir()]);

  const callstack = useCallstack();

  useTauriEvent(
    OperationType.ListDir,
    payload => {
      const { opId, data, error, isFinished } = payload;

      if (error) {
        alert(error);
        callstack.updateStatus(opId, OperationStatus.Error);
        return;
      }

      if (!data) {
        throw new Error("Not implemented");
      }

      entries.set(data.entries);

      if (isFinished) {
        callstack.updateStatus(opId, OperationStatus.Success);

        dir.set(data.path);

        if (data.path !== dir()) {
          emit(EventToBackend.DirChanged, { oldPath: dir(), newPath: data.path });
        }
      }
    },
    [dir()]
  );

  return { dir, entries, selected };
});

export { useCurrentDir, CurrentDirProvider };
