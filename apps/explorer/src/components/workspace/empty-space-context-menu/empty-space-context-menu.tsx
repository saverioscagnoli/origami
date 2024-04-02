import React from "react";
import { ContextMenu } from "@tredici";
import { ChildrenProps } from "@types";
import { useConstants } from "@hooks/use-constants";

const EmptySpaceContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  const { isVscodeInstalled } = useConstants();

  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Open</ContextMenu.Item>
        {isVscodeInstalled.get() && <ContextMenu.Item>Open in VS Code</ContextMenu.Item>}
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
