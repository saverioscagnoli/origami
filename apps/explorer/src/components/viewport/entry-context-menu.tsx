import React, { ReactNode, useRef } from "react";
import { ContextMenu } from "@tredici";
import { Pencil1Icon, StarFilledIcon, TrashIcon } from "@radix-ui/react-icons";
import { useEntryContext } from "@hooks/use-entry-context";
import { DeleteEntryDialog } from "./delete-entry-dialog";
import { useDirectory } from "@hooks/use-directory";

type EntryContextMenuProps = {
  children: ReactNode;
};

const EntryContextMenu: React.FC<EntryContextMenuProps> = ({ children }) => {
  const { selected } = useDirectory();
  const { renaming, entry } = useEntryContext();
  const menuRef = useRef<HTMLDivElement>(null);

  const startRenaming = () => {
    renaming.set(true);
  };

  const onDelete = () => {
    menuRef.current.remove();
  };

  return (
    <ContextMenu onOpenChange={() => selected.set([entry])}>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content ref={menuRef}>
        <ContextMenu.Item leftIcon={<StarFilledIcon />}>Star</ContextMenu.Item>
        <ContextMenu.Item leftIcon={<Pencil1Icon />} onSelect={startRenaming}>
          Rename
        </ContextMenu.Item>
        <DeleteEntryDialog>
          <ContextMenu.Item
            colorScheme="red"
            leftIcon={<TrashIcon />}
            onClick={onDelete}
            onSelect={e => e.preventDefault()}
          >
            Delete
          </ContextMenu.Item>
        </DeleteEntryDialog>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EntryContextMenu };
