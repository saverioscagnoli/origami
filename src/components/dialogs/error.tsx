import { Button, Dialog } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { cn } from "@lib/utils";
import React from "react";

const ErrorDialog = () => {
  const { errors, setErrors } = useGlobalStates();

  const onOpenChange = (value: boolean) => {
    if (!value) {
      setErrors(null);
    }
  };

  return (
    <Dialog open={errors !== null} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <Dialog.Title>
          {errors?.length > 1 ? `${errors.length} Errors!` : "Error!"}
        </Dialog.Title>
        <Dialog.Description>
          {errors?.length > 1
            ? errors?.map((err, i) => (
                <React.Fragment key={i}>
                  <span>
                    Error {i}: {err}
                  </span>
                  <br />
                </React.Fragment>
              ))
            : errors?.at(0)}
        </Dialog.Description>
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
