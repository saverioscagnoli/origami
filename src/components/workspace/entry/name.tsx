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

const ListEntryName: FC<EntryNameProps> = ({ name, path, isDir }) => {
  return (
    <span className={cn("flex items-center gap-1.5")}>
      <span className={cn("min-w-4")}>{isDir ? <FolderIcon /> : <FileIcon />}</span>
      <p
        className={cn("w-32 md:w-40 lg:w-52 xl:w-64", "cursor-default", "truncate")}
      >
        {name}
      </p>
    </span>
  );
};

const GridEntryName: FC<EntryNameProps> = ({ name, path, isDir }) => {
  return (
    <span
      className={cn(
        "w-full h-full",
        "flex flex-col items-center justify-center gap-2"
      )}
    >
      <span className={"w-16 h-16"}>
        {isDir ? (
          <FolderIcon className={cn("w-full h-full")} />
        ) : (
          <FileIcon className={cn("w-full h-full")} />
        )}
      </span>
      <p className={cn("w-full", "cursor-default", "truncate", "text-center")}>
        {name}
      </p>
    </span>
  );
};

export { ListEntryName, GridEntryName };
