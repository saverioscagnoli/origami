import { create } from "zustand";

////////////////////////////////
//                            //
//           Config           //
//                            //
////////////////////////////////

/**
 * This is the store for all the states related to the app config,
 * stored in the app config directory under the name "config.jsonc"
 */
interface Config {
  notifications?: {
    copy?: {
      paths?: string[];
    };
    error?: {
      paths?: string[];
    };
  };

  styles?: {
    copy?: {
      progress?: {
        format?: "b" | "kb" | "mb" | "gb";
      };
    };
  };
}

interface ConfigMethods {
  loadConfig: (config: Partial<Config>) => void;
}

const useConfig = create<{ config?: Config } & ConfigMethods>()(set => ({
  config: {},
  loadConfig: config => {
    set(() => ({ config }));
  }
}));

export { useConfig };
export type { Config };
