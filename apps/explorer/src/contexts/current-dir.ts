import { Accessor, Entry } from "@types";
import { createContext } from "react";

type CurrentDirContextValue = {
  dir: Accessor<string>;
  entries: Accessor<Entry[]>;
  selected: Accessor<Entry[]>;
};

const CurrentDirContext = createContext<CurrentDirContextValue | null>(null);

export { CurrentDirContext };
