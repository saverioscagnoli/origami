import { Accessor } from "@types";
import { createContext } from "react";

type HistoryContextValue = {
  history: Accessor<string[]>;
  index: Accessor<number>;
  canGoBack: boolean;
  canGoForward: boolean;
  goBack: () => void;
  goForward: () => void;
};

const HistoryContext = createContext<HistoryContextValue | null>(null);

export { HistoryContext };
