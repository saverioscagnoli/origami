import { createContext } from "react";

type NavigationContextValue = {
  cd: (path: string) => () => void;
  openFile: (path: string[]) => () => void;
  reload: () => void;
  starEntries: () => void;
  unstarEntries: () => void;
  deleteEntries: () => void;
};

const NavigationContext = createContext<NavigationContextValue | null>(null);

export { NavigationContext };
