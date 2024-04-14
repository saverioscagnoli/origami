import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { createContext } from "react";

type GlobalStatesContextValue = {
  renaming: Accessor<[string, DirEntry]>;
};

const GlobalStatesContext = createContext<GlobalStatesContextValue | null>(null);

export { GlobalStatesContext };
