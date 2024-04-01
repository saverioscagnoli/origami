import React, { ReactNode } from "react";
import { ContextMenu } from "@tredici";
import { cn } from "@utils";
import {
  ClipboardIcon,
  FilePlusIcon,
  PlusIcon,
  ReloadIcon
} from "@radix-ui/react-icons";
import { useDirectory } from "@hooks/use-directory";
import { BsFolderFill } from "react-icons/bs";
import { invoke } from "@tauri-apps/api";

type EmptySpaceContextMenuProps = {
  children: ReactNode;
};
const EmptySpaceContextMenu: React.FC<EmptySpaceContextMenuProps> = ({
  children
}) => {
  const { dir, createFile, createDir, reload, selected, copying } =
    useDirectory();
  const onOpenChange = () => {
    selected.set([]);
  };

  const onPaste = async () => {
    await invoke("paste", {
      source: copying.get().path,
      target: dir.get(),
      cutting: false
    });
    copying.set(null);
    reload();
  };

  return (
    <ContextMenu onOpenChange={onOpenChange}>
      <ContextMenu.Trigger className={cn("w-full h-full")}>
        {children}
      </ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item
          leftIcon={<ClipboardIcon />}
          disabled={copying.get() === null}
          onClick={onPaste}
        >
          Paste
        </ContextMenu.Item>

        <ContextMenu.Separator />

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
