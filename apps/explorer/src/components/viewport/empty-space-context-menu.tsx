import React, { ReactNode } from "react";
import { ContextMenu } from "@tredici";
import { cn } from "@utils";
import { ChevronRightIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";

type EmptySpaceContextMenuProps = {
  children: ReactNode;
};
const EmptySpaceContextMenu: React.FC<EmptySpaceContextMenuProps> = ({
  children
}) => {
  const { reload } = useDirectory();

  return (
    <ContextMenu>
      <ContextMenu.Trigger className={cn("w-full h-full")}>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item leftIcon={<ReloadIcon />} onClick={reload}>
          Reload
        </ContextMenu.Item>
        <ContextMenu.Item leftIcon={<ChevronRightIcon />}>
          Open Terminal
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
