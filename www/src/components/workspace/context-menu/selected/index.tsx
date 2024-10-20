import React from "react";
import { ContextMenu } from "~/components/tredici";

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
        <ContextMenu.Item>Open</ContextMenu.Item>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Item>Delete</ContextMenu.Item>
        <ContextMenu.Item>Move</ContextMenu.Item>
        <ContextMenu.Item>Copy</ContextMenu.Item>
        <ContextMenu.Item>Download</ContextMenu.Item>
        <ContextMenu.Item>Share</ContextMenu.Item>
        <ContextMenu.Item>Properties</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { SelectedEntriesContextMenu };
