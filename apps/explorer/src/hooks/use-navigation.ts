import { Entry } from "@types";
import { invoke } from "@tauri-apps/api";
import { useCurrentDir } from "./use-current-dir";

const useNavigation = () => {
  const { dir, entries } = useCurrentDir();

  const changeDir = (path: string) => async () => {
    let newEntries = await invoke<Entry[]>("read_dir", { path });
    dir.set(path);
    entries.set(newEntries);
  };

  return { changeDir };
};

export { useNavigation };
