import { useDirectory } from "@hooks/use-directory";
import { cn } from "@utils";

const Bottombar = () => {
  const { entries } = useDirectory();
  const items = entries.get();

  return (
    <div
      className={cn(
        "w-full h-6",
        "flex items-center",
        "fixed bottom-0 left-0",
        "bg-[--slate-1]",
        "border-t border-t-[--gray-6]",
        "z-30"
      )}
    >
      <p className={cn("px-6", "text-xs")}>{items.length} Items</p>
    </div>
  );
};

export { Bottombar };
