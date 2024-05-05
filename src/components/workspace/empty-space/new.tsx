import { FolderIcon } from "@components/icons";
import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { FileIcon, PlusIcon } from "@radix-ui/react-icons";

const NewMenuItem = () => {
  const { setCreating } = useGlobalStates();

  const onSelect = (isDir: boolean) => () => {
    setCreating({ state: true, isDir });
  };

  return (
    <>
      <ContextMenu.Sub>
        <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>New</ContextMenu.SubTrigger>
        <ContextMenu.SubContent>
          <ContextMenu.Item leftIcon={<FileIcon />} onSelect={onSelect(false)}>
            File
          </ContextMenu.Item>

          <ContextMenu.Item leftIcon={<FolderIcon />} onSelect={onSelect(true)}>
            Folder
          </ContextMenu.Item>
        </ContextMenu.SubContent>
      </ContextMenu.Sub>
    </>
  );
};

export { NewMenuItem };
