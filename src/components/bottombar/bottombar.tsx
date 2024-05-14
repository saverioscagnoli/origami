import { cn } from "@lib/utils";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const Bottombar = () => {
  const [entries, selected] = useCurrentDir(state => [
    state.entries,
    state.selected
  ]);

  const total = useMemo(() => entries.length, [entries]);
  const hidden = useMemo(() => entries.filter(e => e.isHidden).length, [entries]);
  const selectedCount = useMemo(() => selected.length, [selected]);

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
      <p>
        {total} Items ({hidden} Hidden)
        {selectedCount > 0 && ` - ${selectedCount} Selected`}
      </p>
    </div>
  );
};

export { Bottombar };
