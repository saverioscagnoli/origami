import { ListDir } from "@wails/methods/fs/Filesystem";
import { fs } from "@wails/methods/models";
import { customCreate } from "./store";

type CurrentDirState = {
  dir: string;
  setCurrentDir: (dir: string) => void;
  selected: fs.DirEntry[];
  setSelected: (selected: fs.DirEntry[]) => void;
  entries: fs.DirEntry[];
  setEntries: (entries: fs.DirEntry[]) => void;
  cd: (dir: string) => Promise<void>;
};

const useCurrentDir = customCreate<CurrentDirState>(set => ({
  dir: "/",
  setCurrentDir: dir => set({ dir }),
  entries: [],
  setEntries: entries => set({ entries }),
  selected: [],
  setSelected: selected => set({ selected }),
  cd: async dir => {
    let entries: fs.DirEntry[];

    try {
      entries = await ListDir(dir);
    } catch (e) {
      console.log(e);
      return;
    }

    set({ dir, entries, selected: [] });
  }
}));

export { useCurrentDir };
