import { useDirectory } from "@hooks/use-directory";
import { useEntryContext } from "@hooks/use-entry-context";
import { invoke } from "@tauri-apps/api";
import { Button, Dialog } from "@tredici";
import { cn } from "@utils";
import React, { ReactNode } from "react";

type DeleteEntryDialogProps = {
  children: ReactNode;
};

const DeleteEntryDialog: React.FC<DeleteEntryDialogProps> = ({ children }) => {
  const { dir, reload } = useDirectory();
  const { entry } = useEntryContext();

  const onDelete = async () => {
    await invoke("delete_entry", {
      dir: dir.get(),
      name: entry.name,
      isFolder: entry.is_folder
    });
    reload();
  };

  return (
    <Dialog>
      <Dialog.Trigger asChild>{children}</Dialog.Trigger>
      <Dialog.Content>
        <Dialog.Title>Delete</Dialog.Title>
        <Dialog.Description>
          Are you sure you want to delete this entry?
        </Dialog.Description>
        <div className={cn("flex justify-end gap-4", "mt-4")}>
          <Dialog.Close asChild>
            <Button variant="secondary" colorScheme="b/w">
              Cancel
            </Button>
          </Dialog.Close>
          <Dialog.Close asChild>
            <Button variant="secondary" colorScheme="red" onClick={onDelete}>
              Delete
            </Button>
          </Dialog.Close>
        </div>
        <Dialog.Close />
      </Dialog.Content>
    </Dialog>
  );
};

export { DeleteEntryDialog };
