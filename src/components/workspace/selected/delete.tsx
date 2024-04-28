import { ContextMenu } from "@components/tredici";
import { useNavigation } from "@contexts/navigation";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteMenuItem = () => {
  const { deleteEntries } = useNavigation();

  return (
    <ContextMenu.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      onClick={deleteEntries}
    >
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
