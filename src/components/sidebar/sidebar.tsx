import { cn } from "@lib/utils";
import { DiskGroup } from "./disk-group";
import { SidebarFolderGroup } from "./folder-group";

const Sidebar = () => {
  return (
    <div className={cn("w-1/4 h-full", "border-r border-r-[--gray-6]")}>
      <SidebarFolderGroup />
      <DiskGroup />
    </div>
  );
};

export { Sidebar };
