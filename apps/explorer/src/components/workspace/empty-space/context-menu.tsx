import { FC } from "react";
import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { ReloadMenuItem } from "./reload";
import { PasteMenuItem } from "./paste";
import { NewMenuItem } from "./new";
import { useConstants } from "@hooks/use-constants";
import { OpenInVscodeMenuItem } from "./open-in-vscode";

const EmptySpaceContextMenu: FC<ChildrenProps> = ({ children }) => {
  const { isVscodeInstalled } = useConstants();

  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ReloadMenuItem />
        <ContextMenu.Separator />
        {isVscodeInstalled() && <OpenInVscodeMenuItem />}
        <PasteMenuItem />
        <ContextMenu.Separator />
        <NewMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
