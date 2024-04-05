import { Accessor, Entry } from "@types";
import { createContext } from "react";

type GlobalStatesContextValue = {
  /** First item of the tuple is the entries, second is whether the user is cutting.  */
  clipboardEntries: Accessor<[Entry[], boolean] | null>;
  renaming: Accessor<Entry | null>;
  searching: Accessor<boolean>;
  searchQuery: Accessor<string>;
  creating: Accessor<boolean>;
};

const GlobalStatesContext = createContext<GlobalStatesContextValue | null>(null);

export { GlobalStatesContext };
