import { ContextMenu } from "@components/tredici";
import { useDispatchers } from "@hooks/use-dispatchers";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteMenuItem = () => {
  const { deleteEntries } = useDispatchers();

  return (
    <ContextMenu.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      onSelect={deleteEntries}
    >
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
