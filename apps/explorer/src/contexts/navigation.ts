import { createContext } from "react";

type NavigationContextValue = {
  cd: (path: string) => () => void;
  openFile: (path: string[]) => () => void;
  reload: () => void;
  starEntries: () => void;
  unstarEntries: () => void;
  cutEntries: () => void;
  copyEntries: () => void;
  deleteEntries: () => void;
  renameEntry: (path: string, newName: string) => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export { NavigationContext };
