import React from "react";
import { ContextMenu } from "~/components/tredici";
import { NewEntryMenuItem } from "./new-entry";
import { PasteMenuItem } from "./paste";
import { ReloadMenuItem } from "./reload";

type BlankSpaceContextMenuProps = {
  children: React.ReactNode;
};

const BlankSpaceContextMenu: React.FC<BlankSpaceContextMenuProps> = ({
  children
}) => {
  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ReloadMenuItem />
        <ContextMenu.Separator />
        <PasteMenuItem />
        <ContextMenu.Separator />
        <NewEntryMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { BlankSpaceContextMenu };
