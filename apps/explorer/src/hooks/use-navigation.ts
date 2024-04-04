import { Entry } from "@types";
import { invoke } from "@tauri-apps/api";
import { useCurrentDir } from "./use-current-dir";
import { useGlobalStates } from "./use-global-states";
import { useAccessor } from "./use-accessor";

const useNavigation = () => {
  const changing = useAccessor<boolean>(false);
  const { dir, entries, selected } = useCurrentDir();
  const { renaming } = useGlobalStates();

  const changeDir = (path: string) => async () => {
    changing.set(true);
    let newEntries = await invoke<Entry[]>("read_dir", { path });
    dir.set(path);
    entries.set(newEntries);
    selected.set([]);
    changing.set(false);
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

  const rename = async (newName: string) => {
    await invoke("rename_entry", { path: renaming.get().path, newName });
    await reload();
  };

  return { changeDir, open, reload, rename, changing };
};

export { useNavigation };
