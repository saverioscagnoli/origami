import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Cn function to merge classes and get deterministic class names
 *
 * @param args The classes
 * @returns Merged classes
 */
function cn(...args: ClassValue[]) {
  return twMerge(clsx(args));
}

/**
 * Format bytes into a human-readable string
 *
 * @example
 * formatBytes(1024) // 1 KB
 * formatBytes(1024, 0) // 1 KB
 * formatBytes(32134, 1) // 31.4 KB
 *
 * @param bytes The number of bytes
 * @param decimals How many decimal places to round to
 * @returns A human-readable string of the bytes
 */
function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

export { cn, formatBytes };
