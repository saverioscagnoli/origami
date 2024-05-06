import { FolderIcon } from "@components/icons";
import { fileIconMap } from "@lib/file-icon-map";
import { cn } from "@lib/utils";
import { FileIcon } from "@radix-ui/react-icons";
import { FC } from "react";
import { RenamePopover } from "./rename-popover";

type EntryNameProps = {
  name: string;
  path: string;
  isDir: boolean;
};

const ListEntryName: FC<EntryNameProps> = ({ name, path, isDir }) => {
  return (
    <span className={cn("flex items-center gap-1.5")}>
      <RenamePopover name={name}>
        <span className={cn("min-w-4")}>
          {isDir ? (
            <FolderIcon />
          ) : (
            fileIconMap.get(name.split(".").pop().toLowerCase()) ?? <FileIcon />
          )}
        </span>
      </RenamePopover>
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
          fileIconMap.get(name.split(".").pop().toLowerCase()) ?? (
            <FileIcon className={cn("w-full h-full")} />
          )
        )}
      </span>
      <RenamePopover name={name}>
        <p className={cn("w-full", "cursor-default", "truncate", "text-center")}>
          {name}
        </p>
      </RenamePopover>
    </span>
  );
};

export { GridEntryName, ListEntryName };
