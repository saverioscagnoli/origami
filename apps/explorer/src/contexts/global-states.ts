import { EntryMap } from "@lib/entry-map";
import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { createContext } from "react";

type GlobalStatesContextValue = {
  renaming: Accessor<[string, DirEntry]>;
  cutting: Accessor<EntryMap | null>;
  copying: Accessor<EntryMap | null>;
};

const GlobalStatesContext = createContext<GlobalStatesContextValue | null>(null);

export { GlobalStatesContext };
