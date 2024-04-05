import React from "react";
import { ContextMenu } from "@tredici";
import { ChildrenProps } from "@types";
import { useConstants } from "@hooks/use-constants";
import { OpenVscode } from "./open-vscode";
import { New } from "./new";
import { Paste } from "./paste";
import { Reload } from "./reload";

const EmptySpaceContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  const { isVscodeInstalled } = useConstants();

  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <Reload />
        <ContextMenu.Separator />
        <Paste />
        {isVscodeInstalled.get() && <OpenVscode />}
        <ContextMenu.Separator />
        <New />
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
