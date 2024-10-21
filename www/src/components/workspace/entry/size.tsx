import { FC } from "react";
import { cn, formatBytes } from "~/lib/utils";

type EntrySizeProps = {
  IsDir: boolean;
  Size: number;
};

const EntrySize: FC<EntrySizeProps> = ({ IsDir, Size }) => {
  return (
    <span className={cn("text-[--gray-8]")}>{!IsDir && formatBytes(Size)}</span>
  );
};

export { EntrySize };
