import { cn } from "@lib/utils";
import { TopbarButtonGroup } from "./button-group";
import { TopbarDirDisplay } from "./dir-display";
import { TopbarMenu } from "./menubar";

const Topbar = () => {
  return (
    <div
      id="topbar"
      className={cn(
        "w-full h-8",
        "fixed top-0 left-0 right-0",
        "flex items-center justify-between",
        "border-b border-b-[--gray-6]"
      )}
    >
      <TopbarMenu />
      <TopbarDirDisplay />
      <TopbarButtonGroup />
    </div>
  );
};

export { Topbar };
