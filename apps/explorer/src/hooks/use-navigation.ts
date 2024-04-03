import { Entry } from "@types";
import { invoke } from "@tauri-apps/api";
import { useCurrentDir } from "./use-current-dir";

const useNavigation = () => {
  const { dir, entries, selected } = useCurrentDir();

  const changeDir = (path: string) => async () => {
    let newEntries = await invoke<Entry[]>("read_dir", { path });
    dir.set(path);
    entries.set(newEntries);
    selected.set([]);
  };

  const open = (entry: Entry) => async () => {
    if (entry.is_folder) {
      await changeDir(entry.path)();
    } else {
      await invoke("open_file", { path: entry.path });
    }
  };

  const reload = async () => {
    await changeDir(dir.get())();
  };

  return { changeDir, open, reload };
};

export { useNavigation };
