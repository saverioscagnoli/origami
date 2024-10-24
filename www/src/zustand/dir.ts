import { ListDir } from "@wails/methods/fs/Filesystem";
import { fs } from "@wails/methods/models";
import { customCreate } from "./store";

type CurrentDirState = {
  dir: string;
  /**
   * Flag to indicate that the directory is changing.
   * This is used for when the directory is large, and
   * the system might take a while to list all the files.
   */
  changing: boolean;
  setCurrentDir: (dir: string) => void;
  selected: fs.DirEntry[];
  setSelected: (selected: fs.DirEntry[]) => void;
  entries: fs.DirEntry[];
  setEntries: (entries: fs.DirEntry[]) => void;
  cd: (dir: string) => Promise<void>;
};

const useCurrentDir = customCreate<CurrentDirState>(set => ({
  dir: "/",
  changing: false,
  setCurrentDir: dir => set({ dir }),
  entries: [],
  setEntries: entries => set({ entries }),
  selected: [],
  setSelected: selected => set({ selected }),
  cd: async dir => {
    let entries: fs.DirEntry[];

    set({ changing: true });

    try {
      entries = await ListDir(dir);
    } catch (e) {
      console.log(e);
      set({ changing: false });
      return;
    }

    set({ dir, entries, selected: [], changing: false });
  }
}));

export { useCurrentDir };
