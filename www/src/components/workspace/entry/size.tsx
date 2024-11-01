import React from "react";
import { cn, formatBytes } from "~/lib/utils";

type EntrySizeProps = {
  isDir: boolean;
  size: number;
};

const EntrySize: React.FC<EntrySizeProps> = ({ isDir, size }) => {
  return (
    <span className={cn("text-[--gray-8]")}>{!isDir && formatBytes(size)}</span>
  );
};

export { EntrySize };
