import { useCurrentDir } from "@hooks/use-current-dir";
import { cn } from "@lib/utils";
import { useMemo } from "react";

const BottombarItemCount = () => {
  const { entries } = useCurrentDir();

  const length = useMemo(() => entries.length, [entries]);
  const hidden = useMemo(
    () => entries.filter(entry => entry.isHidden).length,
    [entries]
  );

  return (
    <span className={cn("text-xs")}>
      {length} Items {hidden > 0 && `(${hidden} hidden)`}
    </span>
  );
};

export { BottombarItemCount };
