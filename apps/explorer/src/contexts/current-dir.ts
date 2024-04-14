import { EntryMap } from "@lib/entry-map";
import { Accessor } from "@typings/accessor";
import { createContext } from "react";

type CurrentDirContextValue = {
  dir: Accessor<string>;
  entries: Accessor<EntryMap>;
  selected: Accessor<EntryMap>;
};

const CurrentDirContext = createContext<CurrentDirContextValue | null>(null);

export { CurrentDirContext };
