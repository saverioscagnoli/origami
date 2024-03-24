import { DirEntry, DirectoryContext } from "@contexts/directory-context";
import { invoke } from "@tauri-apps/api";
import React, { ReactNode, useEffect, useState } from "react";

type DirectoryProviderProps = {
  children: ReactNode;
};

const DirectoryProvider: React.FC<DirectoryProviderProps> = ({ children }) => {
  const [dir, setDir] = useState<string>("");
  const [files, setFiles] = useState<DirEntry[]>([]);

  useEffect(() => {
    invoke<DirEntry[]>("read_dir").then(setFiles);
  }, []);

  return (
    <DirectoryContext.Provider value={{ dir, setDir, files, setFiles }}>
      {children}
    </DirectoryContext.Provider>
  );
};

export { DirectoryProvider };
