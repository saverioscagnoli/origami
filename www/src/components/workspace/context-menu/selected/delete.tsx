import { TrashIcon } from "@radix-ui/react-icons";
import { DeleteEntries } from "@wails/methods/fs/Filesystem";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const DeleteMenuItem = () => {
  const selected = useCurrentDir(s => s.selected);

  const onSelect = () => {
    const paths = selected.map(entry => entry.Path);
    DeleteEntries(paths);
  };

  return (
    <ContextMenu.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      onSelect={onSelect}
    >
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
