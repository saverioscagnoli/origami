import React, { ReactNode } from "react";
import { ContextMenu, Dialog } from "@tredici";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";
import { useEntryContext } from "@hooks/use-entry-context";

type EntryContextMenuProps = {
  children: ReactNode;
};

const EntryContextMenu: React.FC<EntryContextMenuProps> = ({ children }) => {
  const { renaming } = useEntryContext();

  const startRenaming = () => {
    renaming.set(true);
  };

  return (
    <Dialog>
      <ContextMenu>
        <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
        <ContextMenu.Content>
          <ContextMenu.Item leftIcon={<Pencil1Icon />} onClick={startRenaming}>
            Rename
          </ContextMenu.Item>
          <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />}>
            Delete
          </ContextMenu.Item>
        </ContextMenu.Content>
      </ContextMenu>
    </Dialog>
  );
};

export { EntryContextMenu };
