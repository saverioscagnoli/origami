import { DirectoryContext } from "@contexts/directory";
import { invoke } from "@tauri-apps/api";
import { DirEntry } from "@types";
import { ReactNode, useEffect, useState } from "react";
import { homeDir } from "@tauri-apps/api/path";
import { toAccessor } from "@utils";

type DirectoryProviderProps = {
  children: ReactNode;
};

const DirectoryProvider: React.FC<DirectoryProviderProps> = ({ children }) => {
  const [dir, setDir] = useState<string>("");
  const [entries, setEntries] = useState<DirEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    homeDir().then(p => {
      setDir(p);
      read(p);
    });
  }, []);

  const read = async (path: string) => {
    const newEntries = await invoke<DirEntry[]>("read_dir", { path });
    setEntries(newEntries);
  };

  const goBack = async () => {
    const oldPath = history.pop()!;
    await read(oldPath);
    setDir(oldPath);
    setHistory(history);
  };

  return (
    <DirectoryContext.Provider
      value={{
        dir: toAccessor([dir, setDir]),
        entries: toAccessor([entries, setEntries]),
        history: toAccessor([history, setHistory]),
        read,
        goBack
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export { DirectoryProvider };
