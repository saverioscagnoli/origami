import { cn } from "@utils";
import { Devices } from "./devices";

const Sidebar = () => {
  return (
    <div className={cn("w-1/4 h-full", "border-r border-r-[--gray-6]")}>
      <Devices />
    </div>
  );
};

export { Sidebar };
