import { FolderIcon } from "@components/icons";
import { useAccessor } from "@hooks/use-accessor";
import { cn } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";
import { FC, useRef } from "react";

type EntryNameProps = {
  name: string;
  path: string;
  isDir: boolean;
};

const EntryName: FC<EntryNameProps> = ({ name, path, isDir }) => {
  const value = useAccessor<string>(name);

  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <span className={cn("flex items-center gap-1.5")}>
      <span className={cn("min-w-4")}>{isDir ? <FolderIcon /> : <FileIcon />}</span>
      <input
        className={cn(
          "bg-transparent",
          "text-base",
          "outline-none",
          "rounded",
          "selection:bg-[--plum-6]",
          "truncate pointer-events-none"
        )}
        value={value()}
        onChange={e => value.set(e.target.value)}
        spellCheck={false}
        ref={inputRef}
      />
    </span>
  );
};

export { EntryName };
