import { FolderIcon } from "@components/icons";
import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { FileIcon, PlusIcon } from "@radix-ui/react-icons";

const NewMenuItem = () => {
  const { renaming } = useGlobalStates();

  const onNewFile = () => {};

  const onNewFolder = () => {};

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>New</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item leftIcon={<FileIcon />} onClick={onNewFile}>
          File
        </ContextMenu.Item>
        <ContextMenu.Item leftIcon={<FolderIcon />} onClick={onNewFolder}>
          Folder
        </ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  );
};

export { NewMenuItem };
