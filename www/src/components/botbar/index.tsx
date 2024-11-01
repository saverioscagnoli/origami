import React from "react";
import { cn } from "~/lib/utils";
import { useDir } from "~/stores/dir";

const Botbar: React.FC = () => {
  const [entries, selected] = useDir(s => [s.entries, s.selected]);

  return (
    <div
      className={cn(
        "w-full h-6",
        "flex items-center",
        "fixed bottom-0",
        "px-5",
        "text-xs",
        "border-t border-t-[--gray-6]"
      )}
    >
      <p>
        {entries.length} Item{entries.length > 1 && "s"}
        {selected.length > 0 && ` - ${selected.length} Selected`}
      </p>
    </div>
  );
};

export { Botbar };
