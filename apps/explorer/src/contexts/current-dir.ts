import { EntryMap } from "@lib/entry-map";
import { Accessor } from "@typings/accessor";
import { DirEntry } from "@typings/dir-entry";
import { createContext } from "react";

type CurrentDirContextValue = {
  dir: Accessor<string>;
  entries: Accessor<EntryMap<string, DirEntry>>;
  selected: Accessor<EntryMap<string, DirEntry>>;
};

const CurrentDirContext = createContext<CurrentDirContextValue | null>(null);

export { CurrentDirContext };
