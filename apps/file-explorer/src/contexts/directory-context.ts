import { Dispatch, SetStateAction, createContext } from "react";

type DirEntry = {
  name: string;
  is_folder: boolean;
  full_path: string;
};

type DirectoryContextValue = {
  dir: string;
  setDir: Dispatch<SetStateAction<string>>;
  files: DirEntry[];
  setFiles: Dispatch<SetStateAction<DirEntry[]>>;
};

const DirectoryContext = createContext<DirectoryContextValue | null>(null);

export { DirectoryContext };
export type { DirEntry, DirectoryContextValue };
