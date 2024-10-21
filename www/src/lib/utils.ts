import { ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...args: ClassValue[]) {
  return twMerge(clsx(...args));
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
 * @param options The options for formatting
 * @param options.decimals The number of decimal places to round to
 * @param options.format The format to return the bytes in
 * @returns A human-readable string of the bytes
 */
function formatBytes(
  bytes: number,
  options: { decimals?: number; format?: "b" | "kb" | "mb" | "gb" } = {}
): string {
  const { decimals = 2, format } = options;
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  let n = parseFloat((bytes / Math.pow(k, i)).toFixed(dm));
  let size = sizes.at(i);

  if (format) {
    switch (format) {
      case "b": {
        n = parseFloat((bytes / Math.pow(k, 0)).toFixed(dm));
        size = sizes.at(0);
        break;
      }

      case "kb": {
        n = parseFloat((bytes / Math.pow(k, 1)).toFixed(dm));
        size = sizes.at(1);
        break;
      }

      case "mb": {
        n = parseFloat((bytes / Math.pow(k, 2)).toFixed(dm));
        size = sizes.at(2);
        break;
      }

      case "gb": {
        n = parseFloat((bytes / Math.pow(k, 3)).toFixed(dm));
        size = sizes.at(3);
        break;
      }
    }
  }

  return `${n.toLocaleString()} ${size}`;
}

export { cn, formatBytes };
