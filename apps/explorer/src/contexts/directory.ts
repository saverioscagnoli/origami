import { Accessor, DirEntry } from "@types";
import { createContext } from "react";

type DirectoryContextValue = {
  dir: Accessor<string>;
  entries: Accessor<DirEntry[]>;
  selected: Accessor<DirEntry[]>;
  history: Accessor<string[]>;
  historyIndex: Accessor<number>;
  showHidden: Accessor<boolean>;
  changing: Accessor<boolean>;
  sep: string;
  changeDir: (path: string, is_folder?: boolean) => void;
  createFile: () => void;
  createDir: () => void;
  read: (path: string) => void;
  reload: () => void;
  goBack: () => void;
  goForward: () => void;
};

const DirectoryContext = createContext<DirectoryContextValue | null>(null);

export { DirectoryContext };
export type { DirectoryContextValue };
