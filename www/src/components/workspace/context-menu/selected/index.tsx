import React from "react";
import { ContextMenu } from "~/components/tredici";
import { StarUnstarMenuItem } from "./star-unstar";

type SelectedEntriesContextMenuProps = {
  children: React.ReactNode;
};

const SelectedEntriesContextMenu: React.FC<SelectedEntriesContextMenuProps> = ({
  children
}) => {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <StarUnstarMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { SelectedEntriesContextMenu };
