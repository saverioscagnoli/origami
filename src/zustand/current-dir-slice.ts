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
 */

interface CurrentDirStore {
  dir: string;
  setDir: (dir: string) => void;
}

const useCurrentDir = create<CurrentDirStore>()(set => ({
  dir: "",
  setDir: dir => set({ dir })
}));

export { useCurrentDir };

