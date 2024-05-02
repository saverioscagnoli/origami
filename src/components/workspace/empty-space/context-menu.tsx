import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { FC } from "react";
import { NewMenuItem } from "./new";
import { PasteMenuItem } from "./paste";
import { ReloadMenuItem } from "./reload";

const EmptySpaceContextMenu: FC<ChildrenProps> = ({ children }) => {
  return (
    <ContextMenu >
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
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
