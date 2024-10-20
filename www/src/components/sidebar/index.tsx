import React from "react";
import { cn } from "~/lib/utils";
import { DiskGroup } from "./disk-group";
import { KnownFolderGroup } from "./known-folder-group";

const Sidebar: React.FC = () => {
  return (
    <div className={cn("w-1/4 h-full", "border-r border-r-[--gray-6]")}>
      <KnownFolderGroup />
      <DiskGroup />
    </div>
  );
};

export { Sidebar };
