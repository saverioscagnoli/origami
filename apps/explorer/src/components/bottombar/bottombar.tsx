import { useCurrentDir } from "@hooks/use-current-dir";
import { cn } from "@utils";
import { useMemo } from "react";

const Bottombar = () => {
  const { entries } = useCurrentDir();
  const n = useMemo(() => entries.get().length, [entries.get()]);

  return (
    <div
      className={cn(
        "w-full h-6",
        "fixed bottom-0",
        "flex items-center",
        "border-t border-t-[--gray-6]",
        "z-30"
      )}
    >
      <p className={cn("px-6", "text-xs")}>{n} Items</p>
    </div>
  );
};

export { Bottombar };
