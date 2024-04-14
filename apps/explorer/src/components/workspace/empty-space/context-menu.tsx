import { FC } from "react";
import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { ReloadMenuItem } from "./reload";
import { PasteMenuItem } from "./paste";
import { NewMenuItem } from "./new";

const EmptySpaceContextMenu: FC<ChildrenProps> = ({ children }) => {
  return (
    <ContextMenu>
      <ContextMenu.Trigger>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ReloadMenuItem />
        <ContextMenu.Separator />
        <PasteMenuItem />
        <ContextMenu.Separator />
        <NewMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
