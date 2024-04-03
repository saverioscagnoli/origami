import { cn } from "@utils";
import { Devices } from "./devices";
import { SidebarFolders } from "./folders";

const Sidebar = () => {
  return (
    <div className={cn("w-1/4 h-full", "border-r border-r-[--gray-6]")}>
      <SidebarFolders />
      <Devices />
    </div>
  );
};

export { Sidebar };
