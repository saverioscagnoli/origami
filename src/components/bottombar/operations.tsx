import { cn } from "@lib/utils";
import { RefreshCw } from "lucide-react";

const BottombarOperationDisplay = () => {
  return (
    <span className={cn("flex items-center gap-2")}>
      <RefreshCw size={15} className={cn("animate-spin")} />
      <p>Copying...</p>
    </span>
  );
};

export { BottombarOperationDisplay };
