import { cn } from "@utils";
import { SidebarFolders } from "./sidebar-folders";
import { SidebarDevices } from "./sidebar-devices";

const Sidebar = () => {
  return (
    <div className={cn("w-1/4 h-full", "border-r border-r-[--gray-6]")}>
      <SidebarFolders />
      <SidebarDevices />
    </div>
  );
};

export { Sidebar };
