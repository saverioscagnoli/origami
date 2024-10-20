import React from "react";
import { cn } from "~/lib/utils";
import { useCurrentDir } from "~/zustand/dir";

const Bottombar: React.FC = () => {
  const [entries, selected] = useCurrentDir(s => [s.entries, s.selected]);

  return (
    <nav
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
        {entries.length} Item{entries.length > 1 && "s"}
        {selected.length > 0 && ` - ${selected.length} Selected`}
      </p>
    </nav>
  );
};

export { Bottombar };
