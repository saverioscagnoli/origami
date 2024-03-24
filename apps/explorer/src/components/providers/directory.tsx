import { DirectoryContext } from "@contexts/directory";
import { invoke } from "@tauri-apps/api";
import { DirEntry } from "@types";
import { ReactNode, useEffect, useState } from "react";

type DirectoryProviderProps = {
  children: ReactNode;
};

const DirectoryProvider: React.FC<DirectoryProviderProps> = ({ children }) => {
  const [dir, setDir] = useState<string>("");
  const [entries, setEntries] = useState<DirEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    invoke<DirEntry[]>("read_dir").then(setEntries);
  }, []);

  useEffect(() => {
    console.log(history);
  }, [history]);

  return (
    <DirectoryContext.Provider
      value={{
        dir: {
          get: () => dir,
          set: setDir
        },
        entries: {
          get: () => entries,
          set: setEntries
        },
        history: {
          get: () => history,
          set: setHistory
        }
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export { DirectoryProvider };
