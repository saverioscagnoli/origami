import { cn } from "@lib/utils";

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
    ></div>
  );
};

export { Bottombar };
