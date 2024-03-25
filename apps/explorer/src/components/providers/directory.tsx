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
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [showHidden, setShowHidden] = useState<boolean>(false);

  useEffect(() => {
    homeDir().then(p => {
      setDir(p);
      setHistory([p]);
      read(p);
    });
  }, []);

  const read = async (path: string) => {
    const newEntries = await invoke<DirEntry[]>("read_dir", { path });
    setEntries(newEntries);
  };

  const changeDir = async (path: string, is_folder?: boolean) => {
    if (!is_folder) return;

    setDir(path);
    setHistory(prevHistory => {
      const newHistory = prevHistory.slice(0, historyIndex + 1);
      newHistory.push(path);
      return newHistory;
    });
    setHistoryIndex(prevIndex => prevIndex + 1);
    read(path);
  };

  const goBack = async () => {
    if (historyIndex > 0) {
      const oldPath = history[historyIndex - 1];
      await read(oldPath);
      setDir(oldPath);
      setHistoryIndex(prevIndex => prevIndex - 1);
    }
  };

  const goForward = async () => {
    if (historyIndex < history.length - 1) {
      const newPath = history[historyIndex + 1];
      await read(newPath);
      setDir(newPath);
      setHistoryIndex(prevIndex => prevIndex + 1);
    }
  };

  return (
    <DirectoryContext.Provider
      value={{
        dir: toAccessor([dir, setDir]),
        entries: toAccessor([entries, setEntries]),
        history: toAccessor([history, setHistory]),
        historyIndex: toAccessor([historyIndex, setHistoryIndex]),
        showHidden: toAccessor([showHidden, setShowHidden]),
        read,
        changeDir,
        goBack,
        goForward
      }}
    >
      {children}
    </DirectoryContext.Provider>
  );
};

export { DirectoryProvider };
