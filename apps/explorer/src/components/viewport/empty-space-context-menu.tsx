import React, { ReactNode } from "react";
import { ContextMenu } from "@tredici";
import { cn } from "@utils";
import { ChevronRightIcon } from "@radix-ui/react-icons";

type EmptySpaceContextMenuProps = {
  children: ReactNode;
};
const EmptySpaceContextMenu: React.FC<EmptySpaceContextMenuProps> = ({
  children
}) => {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className={cn("w-full h-full")}>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item leftIcon={<ChevronRightIcon />}>
          Open Terminal
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
