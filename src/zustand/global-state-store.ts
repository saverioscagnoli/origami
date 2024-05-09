import { DirEntry } from "@typings/dir-entry";
import { create } from "zustand";

////////////////////////////////
//                            //
//       Global States        //
//                            //
////////////////////////////////

/**
 * This is the store for all the global states that are shared across the application.
 * This includes the clipboard, creating state, and renaming state.
 *
 * @interface GlobalStatesStore
 *
 * @property {Clipboard} clipboard - The clipboard object that holds the entries and the cut state.
 * @property {function} setClipboard - A function to set the clipboard object.
 * @property {boolean} creating - A boolean to indicate if the user is creating a new entry.
 * @property {function} setCreating - A function to set the creating state.
 * @property {DirEntry | null} renaming - The entry that is being renamed.
 * @property {function} setRenaming - A function to set the renaming state.
 */

type Clipboard = {
  entries: DirEntry[];
  cut: boolean;
};

type CreatingState = {
  state: boolean;
  isDir: boolean;
};

interface GlobalStatesStore {
  clipboard: Clipboard;
  setClipboard: (clipboard: Clipboard) => void;
  creating: CreatingState;
  setCreating: (creating: Partial<CreatingState>) => void;
  renaming: DirEntry | null;
  setRenaming: (renaming: DirEntry | null) => void;
}

const useGlobalStates = create<GlobalStatesStore>(set => ({
  clipboard: { entries: [], cut: false },
  setClipboard: clipboard => set({ clipboard }),
  creating: { state: false, isDir: false },
  setCreating: creating =>
    set(state => ({ creating: { ...state.creating, ...creating } })),
  renaming: null,
  setRenaming: renaming => set({ renaming })
}));

export { useGlobalStates };
export type { Clipboard, CreatingState, GlobalStatesStore };
