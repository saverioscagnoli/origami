import { ReactNode } from "react";
import { customCreate } from ".";

type KnownFolder = {
  name: string;
  path: string;
  icon: ReactNode;
};

type EnvState = {
  knownFolders: KnownFolder[];
  sep: string;
  configDir: string;
  set: (partial: EnvState | Partial<EnvState>) => void;
};

export type { EnvState, KnownFolder };

const useEnv = customCreate<EnvState>(set => ({
  knownFolders: [],
  sep: "",
  configDir: "",
  set: partial => set(state => ({ ...state, ...partial }))
}));

export { useEnv };
