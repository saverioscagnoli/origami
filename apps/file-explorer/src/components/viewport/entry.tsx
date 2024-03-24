import React from "react";
import { DirEntry } from "@contexts/directory-context";
import { cn } from "@utils";
import { CubeIcon, FileIcon } from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { invoke } from "@tauri-apps/api/tauri";

const Entry: React.FC<DirEntry> = ({ name, full_path, is_folder }) => {
  const { setFiles } = useDirectory();

  const onClick = () => {
    if (!is_folder) return;

    invoke<DirEntry[]>("read_dir", { path: full_path }).then(setFiles);
  };

  return (
    <div
      className={cn(
        "w-full h-6",
        "flex items-center gap-4",
        "px-4",
        "cursor-pointer",
        "hover:bg-[--gray-3]",
        "select-none"
      )}
      onClick={onClick}
    >
      {is_folder ? <CubeIcon /> : <FileIcon />}
      {name}
    </div>
  );
};

export { Entry };
