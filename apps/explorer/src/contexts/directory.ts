import { Accessor, DirEntry } from "@types";
import { createContext } from "react";

type DirectoryContextValue = {
  dir: Accessor<string>;
  entries: Accessor<DirEntry[]>;
  history: Accessor<string[]>;
  historyIndex: Accessor<number>;
  showHidden: Accessor<boolean>
  changeDir: (path: string, is_folder?: boolean) => void;
  read: (path: string) => void;
  goBack: () => void;
  goForward: () => void;
};

const DirectoryContext = createContext<DirectoryContextValue | null>(null);

export { DirectoryContext };
export type { DirectoryContextValue };
