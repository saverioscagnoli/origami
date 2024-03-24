import { Accessor, DirEntry } from "@types";
import { createContext } from "react";

type DirectoryContextValue = {
  dir: Accessor<string>;
  entries: Accessor<DirEntry[]>;
  history: Accessor<string[]>;
};

const DirectoryContext = createContext<DirectoryContextValue | null>(null);

export { DirectoryContext };
export type { DirectoryContextValue };
