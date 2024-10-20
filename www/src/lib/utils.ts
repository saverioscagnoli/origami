import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
}

function joinPath(sep: string, ...paths: string[]): string {
  return paths
    .map(path => path.replace(new RegExp(`\\${sep}+`, "g"), sep))
    .map(path => path.replace(new RegExp(`^\\${sep}|\\${sep}$`, "g"), ""))
    .join(sep);
}

export { cn, joinPath };
