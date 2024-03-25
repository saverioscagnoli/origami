import { Accessor } from "@types";
import { createContext } from "react";

type EntryContextValue = {
  renaming: Accessor<boolean>;
};

const EntryContext = createContext<EntryContextValue | null>(null);

export { EntryContext };
export type { EntryContextValue };
