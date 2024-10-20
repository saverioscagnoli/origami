import { fs } from "@wails/methods/models";
import { customCreate } from "./store";

type Clipboard = {
  entries: fs.DirEntry[];
  cut: boolean;
};

type CreatingState = {
  state: boolean;
  isDir: boolean;
};

type SearchingState = {
  state: boolean;
  query: string;
  where: "here" | "everywhere";
};

type StatesState = {
  clipboard: Clipboard;
  setClipboard: (clipboard: Clipboard) => void;
  creating: CreatingState;
  setCreating: (creating: Partial<CreatingState>) => void;
  renaming: fs.DirEntry | null;
  setRenaming: (renaming: fs.DirEntry | null) => void;
  searching: SearchingState;
  setSearching: (searching: Partial<SearchingState>) => void;
};

const useStates = customCreate<StatesState>(set => ({
  clipboard: { entries: [], cut: false },
  setClipboard: clipboard => set({ clipboard }),
  creating: { state: false, isDir: false },
  setCreating: creating =>
    set(state => ({ creating: { ...state.creating, ...creating } })),
  renaming: null,
  setRenaming: renaming => set({ renaming }),
  searching: { state: false, query: "", where: "here" },
  setSearching: searching =>
    set(state => ({ searching: { ...state.searching, ...searching } }))
}));

export { useStates };
