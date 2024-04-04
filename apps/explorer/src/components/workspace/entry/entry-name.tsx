import React from "react";
import { cn } from "@utils";
import { fileIconMap } from "lib/file-icons";
import { FileIcon } from "@radix-ui/react-icons";
import { BsFolderFill } from "react-icons/bs";

type EntryNameProps = {
  name: string;
  is_folder: boolean;
};

const EntryName: React.FC<EntryNameProps> = ({ name, is_folder }) => {
  return (
    <span className={cn("w-44", "flex items-center gap-2")} draggable>
      <span className="min-w-4">
        {is_folder ? (
          <BsFolderFill />
        ) : (
          fileIconMap.get(name.split(".").pop().toLowerCase()) ?? <FileIcon />
        )}
      </span>
      <input
        className={cn("bg-transparent", "truncate", "pointer-events-none")}
        value={name}
      />
    </span>
  );
};

export { EntryName };
