import React from "react";
import { FolderIcon } from "~/components/icons/folder";
import { getIconFromExtension } from "~/lib/file-icon-map";
import { cn } from "~/lib/utils";
import { RenamePopover } from "./rename-popover";

type DisplayProps = {
  IsDir: boolean;
  Name: string;
};

const ListEntryDisplay: React.FC<DisplayProps> = ({ IsDir, Name }) => {
  return (
    <span className={cn("flex items-center gap-1.5")}>
      <RenamePopover name={Name}>
        <span className={cn("min-w-4")}>
          {IsDir ? (
            <FolderIcon />
          ) : (
            getIconFromExtension(Name.split(".").pop()!)
          )}
        </span>
      </RenamePopover>
      <p className={cn("w-32 md:w-40 lg:w-52 xl:w-64", "truncate")}>{Name}</p>
    </span>
  );
};

const GridEntryDisplay: React.FC<DisplayProps> = ({ IsDir, Name }) => {
  return (
    <span
      className={cn(
        "w-full h-full",
        "flex flex-col items-center justify-center gap-2"
      )}
    >
      <span className={"w-16 h-16"}>
        {IsDir ? (
          <FolderIcon className={cn("w-full h-full")} />
        ) : (
          React.cloneElement(getIconFromExtension(Name.split(".").pop()!), {
            className: cn("w-full h-full")
          })
        )}
      </span>
      <RenamePopover name={Name}>
        <p
          className={cn("w-full", "cursor-default", "truncate", "text-center")}
        >
          {Name}
        </p>
      </RenamePopover>
    </span>
  );
};

export { GridEntryDisplay, ListEntryDisplay };
