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

const EntryName: FC<EntryNameProps> = ({ name, path: _, isDir }) => {
  return (
    <RenamePopover name={name}>
      <span className={cn("flex items-center gap-1.5")}>
        <span className={cn("min-w-4")}>
          {isDir ? (
            <FolderIcon />
          ) : (
            fileIconMap.get(name.split(".").pop()!) ?? (
              <FileIcon className="w-full h-full" />
            )
          )}
        </span>
        <p
          className={cn("w-32 md:w-40 lg:w-52 xl:w-64", "curso-default", "truncate")}
        >
          {name}
        </p>
      </span>
    </RenamePopover>
  );
};

export { EntryName };
