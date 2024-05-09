import { FolderIcon } from "@components/icons";
import { ContextMenu } from "@components/tredici";
import { FileIcon, PlusIcon } from "@radix-ui/react-icons";

const NewMenuItem = () => {
  return (
    <>
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>New</ContextMenu.SubTrigger>
        <ContextMenu.SubContent>
          <ContextMenu.Item leftIcon={<FileIcon />}>File</ContextMenu.Item>

          <ContextMenu.Item leftIcon={<FolderIcon />}>Folder</ContextMenu.Item>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </>
  );
};

export { NewMenuItem };
