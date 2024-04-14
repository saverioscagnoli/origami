import { cn } from "@lib/utils";
import { BottombarItemCount } from "./item-count";

const Bottombar = () => {
  return (
    <div
      className={cn(
        "w-full h-6",
        "fixed bottom-0 left-0",
        "flex items-center gap-4",
        "text-xs",
        "px-6",
        "border-t border-t-[--gray-6]"
      )}
    >
      <BottombarItemCount />
    </div>
  );
};

export { Bottombar };
