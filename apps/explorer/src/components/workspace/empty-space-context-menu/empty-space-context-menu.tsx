import React from "react";
import { ContextMenu } from "@tredici";
import { ChildrenProps } from "@types";
import { useConstants } from "@hooks/use-constants";
import { useNavigation } from "@hooks/use-navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { OpenVscode } from "./open-vscode";

const EmptySpaceContextMenu: React.FC<ChildrenProps> = ({ children }) => {
  const { isVscodeInstalled } = useConstants();
  const { reload } = useNavigation();

  return (
    <ContextMenu>
      <ContextMenu.Trigger asChild>{children}</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item leftIcon={<ReloadIcon />} onClick={reload}>
          Reload
        </ContextMenu.Item>
        {isVscodeInstalled.get() && <OpenVscode />}
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
