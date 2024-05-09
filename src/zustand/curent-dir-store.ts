import { DirEntry } from "@typings/dir-entry";
import { create } from "zustand";

////////////////////////////////
//                            //
//   Current Directory Info   //
//                            //
////////////////////////////////

/**
 * This is the store for all the information related to the current open directory
 * in the user workspace.
 *
 * @interface CurrentDirStore
 *
 * @property {string} dir - The current directory path.
 * @property {function} setDir - A function to set the current directory path.
 * @property {DirEntry[]} entries - The list of entries in the current directory.
 * @property {function} setEntries - A function to set the list of entries in the current directory.
 * @property {DirEntry[]} selected - The list of selected entries in the current directory.
 * @property {function} addSelected - A function to add an entry to the selected list.
 * @property {function} removeSelected - A function to remove an entry from the selected list.
 * @property {function} replaceSelected - A function to replace the selected list with a new entry.
 * @property {function} clearSelected - A function to clear the selected list.
 */

interface CurrentDirStore {
  dir: string;
  setDir: (dir: string) => void;
  entries: DirEntry[];
  setEntries: (entries: DirEntry[]) => void;
  selected: DirEntry[];
  addSelected: (entry: DirEntry) => void;
  removeSelected: (entry: DirEntry) => void;
  replaceSelected: (entry: DirEntry[]) => void;
  clearSelected: () => void;
}

const useCurrentDir = create<CurrentDirStore>()(set => ({
  dir: "",
  setDir: dir => set({ dir }),
  entries: [],
  setEntries: entries => set({ entries }),
  selected: [],
  addSelected: entry => set(state => ({ selected: [...state.selected, entry] })),
  removeSelected: entry =>
    set(state => ({ selected: state.selected.filter(e => e.path !== entry.path) })),
  replaceSelected: entries => set({ selected: entries }),
  clearSelected: () => set({ selected: [] })
}));

export { useCurrentDir };
