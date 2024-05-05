import { ContextMenu } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteMenuItem = () => {
  const { deleteEntries } = useCommands();
  const { selected } = useCurrentDir();

  const onSelect = () => {
    const paths = selected.map(e => e.path);
    deleteEntries(paths);
  };

  return (
    <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />} onSelect={onSelect}>
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
