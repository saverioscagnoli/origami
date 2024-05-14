import { Button, Dialog } from "@components/tredici";
import { cn } from "@lib/utils";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

const ErrorDialog = () => {
  const [error, setError] = useGlobalStates(s => [s.error, s.setError]);

  const open = useMemo(() => error !== null, [error]);

  const onOpenChange = (val: boolean) => {
    if (!val) {
      setError(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Error!</Dialog.Title>
        <Dialog.Description>{error}</Dialog.Description>
        <div className={cn("flex justify-end")}>
          <Dialog.Close>
            <Button>Ok</Button>
          </Dialog.Close>
        </div>

        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  );
};

export { ErrorDialog };
