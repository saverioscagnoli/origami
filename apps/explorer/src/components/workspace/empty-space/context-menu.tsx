import { FC } from "react";
import { ContextMenu } from "@components/tredici";
import { ChildrenProps } from "@typings/props";
import { ReloadMenuItem } from "./reload";
import { PasteMenuItem } from "./paste";
import { NewMenuItem } from "./new";
import { useConstants } from "@hooks/use-constants";
import { OpenInVscodeMenuItem } from "./open-in-vscode";
import { OpenInWindowsTerminalMenuItem } from "./open-in-windows-terminal";

const EmptySpaceContextMenu: FC<ChildrenProps> = ({ children }) => {
  const { isVscodeInstalled, isWindowsTerminalInstalled } = useConstants();

  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ReloadMenuItem />
        <ContextMenu.Separator />
        {isVscodeInstalled() && <OpenInVscodeMenuItem />}
        {isWindowsTerminalInstalled() && <OpenInWindowsTerminalMenuItem />}
        <PasteMenuItem />
        <ContextMenu.Separator />
        <NewMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
