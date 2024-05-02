import { useAccessor } from "@hooks/use-accessor";
import { createContextHook, createContextProvider } from "@lib/utils";
import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { createContext } from "react";

type GlobalStatesContextValue = {
  creating: Accessor<{ state: boolean; isDir: boolean }>
  renaming: Accessor<DirEntry | null>;
  cutting: Accessor<DirEntry[]>;
  copying: Accessor<DirEntry[]>;
};

const GlobalStatesContext = createContext<GlobalStatesContextValue | null>(null);

const useGlobalStates = createContextHook(GlobalStatesContext, "GlobalStates");

const GlobalStatesProvider = createContextProvider(GlobalStatesContext, () => {
  const creating = useAccessor<{ state: boolean; isDir: boolean }>({
    state: false,
    isDir: false
  });
  const renaming = useAccessor<DirEntry | null>(null);
  const cutting = useAccessor<DirEntry[]>([]);
  const copying = useAccessor<DirEntry[]>([]);

  return {
    creating,
    renaming,
    cutting,
    copying
  };
});

export { GlobalStatesProvider, useGlobalStates };
