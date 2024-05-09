import { DirEntry } from "@typings/dir-entry";
import { CreatingState } from "@zustand/global-state-store";
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

/**
 * Returns the percentage of a part of a total.
 *
 * @param part The portion of the total.
 * @param total The total value.
 * @param decimals How many decimal places to round to.
 * @returns A string representation of the percentage.
 */
function percentage(part: number, total: number, decimals: number = 0): string {
  return parseFloat(((part / total) * 100).toFixed(decimals)) + "%";
}

/**
 * Checks if the hotkey is valid
 * For valid, is intended that the hotkey should not be fired is the user is:
 * 1 - Creating a new entry
 * 2 - Renaming an entry
 * 3 - The hotkey is being repeated
 *
 * For example, anytime the user is typing, the hotkey should not be fired.
 *
 * @param renaming The renaming state
 * @param creating The creating state
 * @param repeat If the hotkey is being repeated
 * @returns a boolean indicating if the hotkey is valid
 */
function isHotkeyInvalid(
  renaming: DirEntry | null = {} as DirEntry,
  creating: CreatingState = {} as CreatingState,
  repeat: boolean = true
) {
  return renaming || creating.state || repeat;
}

export { cn, formatBytes, isHotkeyInvalid, percentage };