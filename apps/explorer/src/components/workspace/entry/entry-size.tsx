import { cn, formatSize } from "@utils";
import React from "react";

type EntrySizeProps = {
  size: number;
};

const EntrySize: React.FC<EntrySizeProps> = ({ size }) => {
  return <span className={cn("text-[--gray-10]")}>{formatSize(size)}</span>;
};

export { EntrySize };
