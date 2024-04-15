import { cn, formatBytes } from "@lib/utils";
import { FC } from "react";

type EntrySizeProps = {
  isDir: boolean;
  size: number;
};

const EntrySize: FC<EntrySizeProps> = ({ isDir, size }) => {
  return <span className={cn("text-[--gray-8]")}>{!isDir && formatBytes(size)}</span>;
};

export { EntrySize };
