import { useAccessor } from "@hooks/use-accessor";
import { createContextHook, createContextProvider } from "@lib/utils";
import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { createContext } from "react";

type GlobalStatesContextValue = {
  renaming: Accessor<DirEntry | null>;
  cutting: Accessor<DirEntry[]>;
  copying: Accessor<DirEntry[]>;
};

const GlobalStatesContext = createContext<GlobalStatesContextValue | null>(null);

const useGlobalStates = createContextHook(GlobalStatesContext, "GlobalStates");

const GlobalStatesProvider = createContextProvider(GlobalStatesContext, () => {
  const renaming = useAccessor<DirEntry | null>(null);
  const cutting = useAccessor<DirEntry[]>([]);
  const copying = useAccessor<DirEntry[]>([]);

  return {
    renaming,
    cutting,
    copying
  };
});

export { useGlobalStates, GlobalStatesProvider };
