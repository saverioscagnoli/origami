import React, { ReactNode } from "react";
import { cn } from "@utils";
import {
  ArchiveIcon,
  CubeIcon,
  DiscIcon,
  FileIcon,
  FileTextIcon,
  ImageIcon
} from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { DirEntry } from "@types";
import { BsFolderFill } from "react-icons/bs";

const fileIconMap = new Map<string, ReactNode>([
  ["txt", <FileTextIcon />],
  ["jpg", <ImageIcon />],
  ["jpeg", <ImageIcon />],
  ["png", <ImageIcon />],
  ["gif", <ImageIcon />],
  ["webp", <ImageIcon />],
  ["svg", <ImageIcon />],
  ["zip", <ArchiveIcon />],
  ["rar", <ArchiveIcon />],
  ["7z", <ArchiveIcon />],
  ["tar", <ArchiveIcon />],
  ["gz", <ArchiveIcon />],
  ["mp3", <DiscIcon />],
  ["wav", <DiscIcon />],
  ["ogg", <DiscIcon />],
  ["exe", <CubeIcon />],
  ["msi", <CubeIcon />],
  ["appImage", <CubeIcon />]
]);

const Entry: React.FC<DirEntry> = ({ name, path, is_folder }) => {
  const { dir, read, history } = useDirectory();

  const onClick = () => {
    if (!is_folder) return;

    dir.set(path);

    history.set(p => [...p, path.split("\\").slice(0, -1).join("\\")]);
    read(path);
  };

  return (
    <div
      className={cn(
        "w-full h-6",
        "flex items-center gap-4",
        "px-4",
        "text-sm",
        "cursor-pointer",
        "hover:bg-[--gray-3]",
        "select-none"
      )}
      onClick={onClick}
    >
      {is_folder ? (
        <BsFolderFill />
      ) : (
        fileIconMap.get(name.split(".").pop()!) ?? <FileIcon />
      )}
      <p
        className={cn(
          "w-52",
          "text-ellipsis",
          "overflow-hidden",
          "whitespace-nowrap"
        )}
      >
        {name}
      </p>
    </div>
  );
};

export { Entry };
