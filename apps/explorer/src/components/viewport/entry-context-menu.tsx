import React, { ReactNode } from "react";
import { ContextMenu } from "@tredici";
import { Pencil1Icon, TrashIcon } from "@radix-ui/react-icons";

type EntryContextMenuProps = {
  children: ReactNode;
};

const EntryContextMenu: React.FC<EntryContextMenuProps> = ({ children }) => {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item leftIcon={<Pencil1Icon />}>Rename</ContextMenu.Item>
        <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />}>
          Delete
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EntryContextMenu };
