import {
  DesktopIcon,
  DownloadIcon,
  HomeIcon,
  ImageIcon,
  ReaderIcon,
  StarFilledIcon
} from "@radix-ui/react-icons";
import { ChildrenProps } from "@typings/props";
import { ClassValue, clsx } from "clsx";
import { Context, FC, ReactNode, useContext } from "react";
import { twMerge } from "tailwind-merge";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

function createContextHook<T>(ctx: Context<T>, name: string) {
  return () => {
    const value = useContext(ctx);

    if (!value) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
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

const basicDirIconMap = new Map<string, ReactNode>([
  ["StarFilledIcon", <StarFilledIcon />],
  ["HomeIcon", <HomeIcon />],
  ["DesktopIcon", <DesktopIcon />],
  ["DownloadIcon", <DownloadIcon />],
  ["ReaderIcon", <ReaderIcon />],
  ["ImageIcon", <ImageIcon />]
]);

export {
  basicDirIconMap,
  cn,
  createContextHook,
  createContextProvider,
  formatBytes,
  percentage
};
