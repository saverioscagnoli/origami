import { ListDir } from "@wails/go/fs/Filesystem";
import { fs } from "@wails/go/models";
import { useEffect } from "react";
import { customCreate } from ".";

type DirState = {
  dir: string;
  entries: fs.DirEntry[];
  selected: fs.DirEntry[];
  set: (
    partial:
      | DirState
      | Partial<DirState>
      | ((state: DirState) => DirState | Partial<DirState>)
  ) => void;
  cd: (path: string) => Promise<void>;
  isChanging: boolean;

  /**
   * HELPERS
   */
  // Selects all the entries in the current directory
  selectAll: () => void;
  // Reloads the current directory
  reload: () => void;
  // Adds an entry
  addEntry: (entry: fs.DirEntry) => void;
  // Deletes an entry
  deleteEntry: (path: string) => void;
};

export type { DirState };

const useDir = customCreate<DirState>((set, get) => ({
  dir: "",
  entries: [],
  selected: [],
  set: partial =>
    set(state => {
      const newState = typeof partial === "function" ? partial(state) : partial;
      return { ...state, ...newState };
    }),
  cd: async path => {
    let entries: fs.DirEntry[];
    set({ isChanging: true });

    try {
      entries = await ListDir(path);
    } catch (e) {
      console.error(e);
      set({ isChanging: false });
      return;
    }

    set({ dir: path, entries, isChanging: false });
  },
  isChanging: false,

  selectAll: () => set(state => ({ ...state, selected: state.entries })),
  reload: () => {
    const { cd, dir } = get();
    cd(dir);
  },
  addEntry: entry => set(state => ({ entries: [...state.entries, entry] })),
  deleteEntry: path =>
    set(state => ({ entries: state.entries.filter(e => e.path !== path) }))
}));

export { useDir };

/**
 * Watches the current directory state, and performs
 * all the actions that need to be done when the directory changes
 * e.g deselecting all files, etc
 */
function watchDir() {
  const [dir, setDir] = useDir(s => [s.dir, s.set]);

  /**
   * When dir changes:
   * - Deselect all entries
   */
  useEffect(() => {
    setDir({ selected: [] });
  }, [dir]);
}

export { watchDir };
