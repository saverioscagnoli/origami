import { cn } from "@utils";
import { TopbarMenu } from "./topbar-menu";
import { TopbarButtons } from "./topbar-buttons";

const Topbar = () => {
  return (
    <div
      className={cn(
        "w-full h-8",
        "flex justify-between",
        "fixed top-0 left-0",
        "border-b border-b-[--gray-6]"
      )}
    >
      <TopbarMenu />
      <TopbarButtons />
    </div>
  );
};

export { Topbar };
