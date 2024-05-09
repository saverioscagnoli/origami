////////////////////////////////
//                            //
//        Environment         //
//                            //
////////////////////////////////

import { ReactNode } from "react";
import { create } from "zustand";

/**
 * A representation of a basic directory.
 * (Documents, Downloads, etc.)
 */
type BasicDir = {
  path: string;
  icon: ReactNode;
};

/**
 * This is the store for all the information related to the workspace environment.
 * All the info like, the custom context menu entries, the basic directories, etc.
 *
 * For basic directories, see {@link BasicDir}.
 *
 * @interface EnvironmentStore
 *
 * @property {BasicDir[]} basicDirs - The list of basic directories.
 */

interface EnvironmentStore {
  basicDirs: BasicDir[];
  resolveBasicdirs: () => Promise<void>;
}

const useEnvironment = create<EnvironmentStore>()(set => ({
  basicDirs: [],
  resolveBasicdirs: async () => {
    const {
      appConfigDir,
      homeDir,
      desktopDir,
      downloadDir,
      documentDir,
      pictureDir,
      sep
    } = await import("@tauri-apps/api/path");

    const {
      DesktopIcon,
      DownloadIcon,
      HomeIcon,
      ImageIcon,
      ReaderIcon,
      StarFilledIcon
    } = await import("@radix-ui/react-icons");

    const promises = [
      appConfigDir(),
      homeDir(),
      desktopDir(),
      downloadDir(),
      documentDir(),
      pictureDir()
    ];

    const icons = [
      <StarFilledIcon />,
      <HomeIcon />,
      <DesktopIcon />,
      <DownloadIcon />,
      <ReaderIcon />,
      <ImageIcon />
    ];

    const basicDirs: BasicDir[] = [];

    for (let i = 0; i < promises.length; i++) {
      const promise = promises.at(i)!;

      try {
        let path = await promise;
        const icon = icons.at(i)!;

        if (i === 0) {
          path += sep() + "Starred";
        }

        basicDirs.push({ path, icon });
      } catch {
        console.warn(`Failed to resolve one of the basic directories.`);
      }
    }

    set(() => ({ basicDirs }));
  }
}));

export { useEnvironment };
