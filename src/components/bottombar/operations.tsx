import { useCallstack } from "@hooks/use-callstack";
import { OperationStatus, OperationType } from "@lib/operations";
import { cn } from "@lib/utils";
import { RefreshCw } from "lucide-react";
import { useMemo } from "react";

const BottombarOperationDisplay = () => {
  const callstack = useCallstack();

  // Get the first pending operation
  const firstOp = useMemo(
    () => callstack.find(op => op.status === OperationStatus.Pending) ?? null,
    [callstack]
  );

  // Display a label for the operation
  const label = useMemo(() => {
    if (firstOp === null) return null;

    switch (firstOp.type) {
      case OperationType.PasteEntries:
        return "Copying...";
      case OperationType.DeleteEntries:
        return "Deleting...";

      default:
        return null;
    }
  }, [firstOp]);

  return (
    label && (
      <span className={cn("flex items-center gap-2")}>
        <RefreshCw size={15} /* className={cn("animate-spin")} */ id="refresh" />
        <p>{label}</p>
      </span>
    )
  );
};

export { BottombarOperationDisplay };
