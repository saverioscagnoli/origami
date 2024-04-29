import { cn } from "@lib/utils";
import { BottombarItemCount } from "./item-count";
import { BottombarOperationDisplay } from "./operations";

const Bottombar = () => {
  return (
    <div
      className={cn(
        "w-full h-6",
        "fixed bottom-0 left-0",
        "flex items-center justify-between",
        "text-xs",
        "px-6",
        "border-t border-t-[--gray-6]"
      )}
    >
      <BottombarItemCount />
      <BottombarOperationDisplay />
    </div>
  );
};

export { Bottombar };
