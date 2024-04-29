import {
  DesktopIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import {
  appConfigDir,
  desktopDir,
  documentDir,
  downloadDir,
  homeDir,
  pictureDir,
  sep
} from "@tauri-apps/api/path";
import { BasicDir } from "@typings/basic-dir";
import { ChildrenProps } from "@typings/props";
import { clsx, ClassValue } from "clsx";
import { Context, FC, ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

function createContextHook<T>(ctx: Context<T>, name: string) {
  return () => {
    const value = useContext(ctx);

    if (!value) {
      throw new Error(`${name} must be used within a ${name}Provider`);
    }

    return value;
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
  const basicDirs: BasicDir[] = [];

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

      basicDirs.push({ path, icon });
    } catch {
      console.warn("Failed to resolve one of the basic directories.");
    }
  }

  return basicDirs;
}

function percentage(part: number, total: number, decimals: number = 0): string {
  return parseFloat(((part / total) * 100).toFixed(decimals)) + "%";
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
  percentage,
  formatBytes
};
