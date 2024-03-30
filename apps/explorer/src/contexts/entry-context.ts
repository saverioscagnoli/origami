import { Accessor, DirEntry } from "@types";
import { createContext } from "react";

type EntryContextValue = {
  entry: DirEntry;
  renaming: Accessor<boolean>;
};

const EntryContext = createContext<EntryContextValue | null>(null);

export { EntryContext };
export type { EntryContextValue };
