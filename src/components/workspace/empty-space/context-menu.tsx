import { ContextMenu } from "@components/tredici";
import { useEnvironment } from "@hooks/use-environment";
import { ChildrenProps } from "@typings/props";
import { FC } from "react";
import { NewMenuItem } from "./new";
import { OpenInVsCodeMenuItem } from "./open-in-vscode";
import { PasteMenuItem } from "./paste";
import { ReloadMenuItem } from "./reload";
import { OpenInWindowsTerminalMenuItem } from "./open-in-windows-terminal";

const EmptySpaceContextMenu: FC<ChildrenProps> = ({ children }) => {
  const { isVscodeInstalled, isWindowsTerminalInstalled } = useEnvironment();

  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ReloadMenuItem />
        <ContextMenu.Separator />
        <PasteMenuItem />
        {isVscodeInstalled && <OpenInVsCodeMenuItem />}
        {isWindowsTerminalInstalled && <OpenInWindowsTerminalMenuItem />}
        <ContextMenu.Separator />
        <NewMenuItem />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
