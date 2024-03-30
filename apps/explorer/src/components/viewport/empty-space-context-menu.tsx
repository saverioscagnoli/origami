import React, { ReactNode } from "react";
import { ContextMenu } from "@tredici";
import { cn } from "@utils";
import { FilePlusIcon, PlusIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { BsFolderFill } from "react-icons/bs";

type EmptySpaceContextMenuProps = {
  children: ReactNode;
};
const EmptySpaceContextMenu: React.FC<EmptySpaceContextMenuProps> = ({
  children
}) => {
  const { createFile, createDir, reload, selected } = useDirectory();
  const onOpenChange = () => {
    selected.set([]);
  };

  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenu.Trigger className={cn("w-full h-full")}>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>
            New...
          </ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item leftIcon={<BsFolderFill />} onClick={createDir}>
              Folder
            </ContextMenu.Item>
            <ContextMenu.Item leftIcon={<FilePlusIcon />} onClick={createFile}>
              File
            </ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
        <ContextMenu.Item leftIcon={<ReloadIcon />} onClick={reload}>
          Reload
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
};

export { EmptySpaceContextMenu };
