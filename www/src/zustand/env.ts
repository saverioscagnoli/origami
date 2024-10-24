import { ReactNode } from "react";
import { KnownFolder } from "~/components/sidebar/known-folder";
import { customCreate } from "./store";

type KnownFolder = {
  icon: ReactNode;
  path: string;
  name: string;
};

export type { KnownFolder };

type EnvState = {
  sep: string;
  // This is used only the app starts, but I dont know
  // how to not create a hook just for that.
  setSep: (sep: string) => void;
  // Could mainly be "windows", "linux" or "darwin"
  os: string;
  setOs: (os: string) => void;
  knownFolders: KnownFolder[];
  setKnownFolders: (folders: KnownFolder[]) => void;
  configDir: string;
  setConfigDir: (configDir: string) => void;
};

const useEnv = customCreate<EnvState>(set => ({
  knownFolders: [],
  setKnownFolders: folders => set({ knownFolders: folders }),
  sep: "",
  setSep: sep => set({ sep }),
  os: "",
  setOs: os => set({ os }),
  configDir: "",
  setConfigDir: configDir => set({ configDir })
}));

export { useEnv };
