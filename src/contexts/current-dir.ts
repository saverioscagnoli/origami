import { Accessor, createContext, createSignal, useContext } from "solid-js";
import { createContextHook, createContextProvider } from "@lib/utils";
import { DirEntry } from "@typings/dir-entry";

type CurrentDirContextValue = {
  dir: Accessor<string>;
  setDir: (dir: string) => void;
  entries: Accessor<DirEntry[]>;
  setEntries: (entries: DirEntry[]) => void;
};

const CurrentDirContext = createContext<CurrentDirContextValue>();

const useCurrentDir = createContextHook(CurrentDirContext, "CurrentDir");

const CurrentDirProvider = createContextProvider(CurrentDirContext, () => {
  const [dir, setDir] = createSignal("");
  const [entries, setEntries] = createSignal<DirEntry[]>([]);

  return { dir, setDir, entries, setEntries };
});

export { CurrentDirProvider, useCurrentDir };
