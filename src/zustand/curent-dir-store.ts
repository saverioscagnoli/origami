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
 */

interface CurrentDirStore {
  dir: string;
  setDir: (dir: string) => void;
  entries: DirEntry[];
  setEntries: (entries: DirEntry[]) => void;
}

const useCurrentDir = create<CurrentDirStore>()(set => ({
  dir: "",
  setDir: dir => set({ dir }),
  entries: [],
  setEntries: entries => set({ entries })
}));

export { useCurrentDir };
