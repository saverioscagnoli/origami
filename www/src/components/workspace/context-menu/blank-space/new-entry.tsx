import { FileIcon, PlusIcon } from "@radix-ui/react-icons";
import React from "react";
import { FolderIcon } from "~/components/icons/folder";
import { ContextMenu } from "~/components/tredici";
import { useStates } from "~/zustand/states";

const NewEntryMenuItem: React.FC = () => {
  const setCreating = useStates(s => s.setCreating);

  const onSelect = (isDir: boolean) => () => {
    setCreating({ state: true, isDir });
  };

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>
        New
      </ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item leftIcon={<FileIcon />} onSelect={onSelect(false)}>
          File
        </ContextMenu.Item>
        <ContextMenu.Item leftIcon={<FolderIcon />} onSelect={onSelect(true)}>
          Folder
        </ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  );
};

export { NewEntryMenuItem };
