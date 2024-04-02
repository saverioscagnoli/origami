import { clsx, ClassValue } from "clsx";
import { Context, useContext } from "react";
import { twMerge } from "tailwind-merge";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

function createContextHook<T>(Context: Context<T>, name: string): () => T {
  return () => {
    const ctx = useContext(Context);

    if (!ctx) {
      throw new Error(`use${name} must be used within a ${name}Provider`);
    }

    return ctx;
  };
}

function formatSize(size: number): string {
  const units = ["B", "KB", "MB", "GB"];
  let unit = 0;

  while (size >= 1024 && unit < units.length) {
    size /= 1024;
    unit++;
  }

  return `${size.toFixed(2)} ${units[unit]}`;
}

export { cn, createContextHook, formatSize };
