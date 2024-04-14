import { clsx, ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Context, FC, ReactNode, useContext } from "react";
import { ChildrenProps } from "@typings/props";
import {
  appConfigDir,
  desktopDir,
  documentDir,
  downloadDir,
  homeDir,
  pictureDir,
  sep
} from "@tauri-apps/api/path";
import {
  DesktopIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

function createContextHook<T>(Context: Context<T>, name: string): () => T {
  return () => {
    const ctx = useContext<T>(Context);

    if (!ctx) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    return ctx;
  };
}

function createContextProvider<T>(
  Context: Context<T>,
  setup: () => T
): FC<ChildrenProps> {
  return ({ children }) => (
    <Context.Provider value={setup()}>{children}</Context.Provider>
  );
}

async function resolveBasicDirs() {
  const dirMap = new Map<string, ReactNode>();

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

  for (let i = 0; i < promises.length; i++) {
    const promise = promises[i];

    try {
      let path = await promise;
      const icon = icons[i];

      if (i === 0) {
        path += sep() + "Starred";
      }

      dirMap.set(path, icon);
    } catch {
      console.error("Failed to resolve one of the basic directories.");
    }
  }

  return dirMap;
}

function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export {
  cn,
  createContextHook,
  createContextProvider,
  resolveBasicDirs,
  formatBytes
};
