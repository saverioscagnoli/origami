import { Button, Dialog } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { cn } from "@lib/utils";

const ErrorDialog = () => {
  const { error, setError } = useGlobalStates();

  const onOpenChange = (value: boolean) => {
    if (!value) {
      setError(null);
    }
  };

  return (
    <Dialog open={error !== null} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>Error!</Dialog.Title>
        <Dialog.Description>{error}</Dialog.Description>
        <Dialog.Close />
        <div className={cn("flex justify-end")}>
          <Dialog.Close>
            <Button colorScheme="b/w" variant="secondary">
              Ok
            </Button>
          </Dialog.Close>
        </div>
      </Dialog.Content>
    </Dialog>
  );
};

export { ErrorDialog };
