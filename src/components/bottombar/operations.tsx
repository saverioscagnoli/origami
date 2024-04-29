import { useCallstack } from "@contexts/callstack";
import { useAccessor } from "@hooks/use-accessor";
import { Operation, OperationStatus, OperationType } from "@lib/operations";
import { cn } from "@lib/utils";
import { sep } from "@tauri-apps/api/path";
import { RefreshCw } from "lucide-react";
import { useEffect } from "react";

const BottombarOperationDisplay = () => {
  const callstack = useCallstack();

  const firstOp = callstack.getPendingOperations()?.at(0);

  return (
    firstOp && (
      <span className={cn("flex items-center gap-2")}>
        <RefreshCw size={15} className={cn("animate-spin")} />
        <p>Copying...</p>
      </span>
    )
  );
};

export { BottombarOperationDisplay };
