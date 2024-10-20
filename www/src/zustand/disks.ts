import { fs } from "@wails/methods/models";
import { customCreate } from "./store";

type DisksState = {
  disks: fs.Disk[];
  setDisks: (disks: fs.Disk[]) => void;
};

const useDisks = customCreate<DisksState>(set => ({
  disks: [],
  setDisks: disks => set({ disks })
}));

export { useDisks };
