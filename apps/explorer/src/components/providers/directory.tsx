import { DirectoryContext } from "@contexts/directory";
import { invoke } from "@tauri-apps/api";
import { DirEntry } from "@types";
import { ReactNode, useEffect, useState } from "react";
import { homeDir, sep } from "@tauri-apps/api/path";
import { toAccessor } from "@utils";

type DirectoryProviderProps = {
  children: ReactNode;
};

const DirectoryProvider: React.FC<DirectoryProviderProps> = ({ children }) => {
  const [dir, setDir] = useState<string>("");
  const [entries, setEntries] = useState<DirEntry[]>([]);
  const [selected, setSelected] = useState<DirEntry[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);

  const [showHidden, setShowHidden] = useState<boolean>(false);
  const [changing, setChanging] = useState<boolean>(false);

  useEffect(() => {
    homeDir().then(p => {
      setDir(p);
      setHistory([p]);
      read(p);
    });
  }, []);

  useEffect(() => {
    setSelected([]);
  }, [dir]);

  const read = async (path: string) => {
    setChanging(true);
    const newEntries = await invoke<DirEntry[]>("read_dir", { path });

    newEntries.sort((a, b) => {
      if (a.is_folder && !b.is_folder) return -1;
      if (!a.is_folder && b.is_folder) return 1;
      return a.name.localeCompare(b.name);
    });

    setEntries(newEntries);
    setChanging(false);
  };

  const changeDir = async (path: string, is_folder: boolean = true) => {
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
        selected: toAccessor([selected, setSelected]),
        history: toAccessor([history, setHistory]),
        historyIndex: toAccessor([historyIndex, setHistoryIndex]),
        showHidden: toAccessor([showHidden, setShowHidden]),
        changing: toAccessor([changing, setChanging]),
        sep,
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
