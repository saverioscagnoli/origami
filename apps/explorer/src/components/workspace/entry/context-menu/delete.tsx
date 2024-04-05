import { ContextMenu } from "@tredici";
import { TrashIcon } from "@radix-ui/react-icons";
import { useNavigation } from "@hooks/use-navigation";

const Delete = () => {
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

export { Delete };
