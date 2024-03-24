import React from "react";
import { cn } from "@utils";
import { CubeIcon, FileIcon } from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { invoke } from "@tauri-apps/api/tauri";
import { DirEntry } from "@types";

const Entry: React.FC<DirEntry> = ({ name, path, is_folder }) => {
  const { dir, entries, history } = useDirectory();

  const onClick = () => {
    if (!is_folder) return;

    dir.set(path);

    history.set(p => [...p, path.split("\\").slice(0, -1).join("\\")]);
    invoke<DirEntry[]>("read_dir", { path }).then(entries.set);
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
