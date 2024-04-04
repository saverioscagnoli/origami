import { Accessor, Entry } from "@types";
import { createContext } from "react";

type GlobalStatesContextValue = {
  /** First item of the tuple is the entries, second is whether the user is cutting.  */
  clipboardEntries: Accessor<[Entry[], boolean] | null>;
};

const GlobalStatesContext = createContext<GlobalStatesContextValue | null>(null);

export { GlobalStatesContext };