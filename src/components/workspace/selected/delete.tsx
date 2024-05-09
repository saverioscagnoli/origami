import { ContextMenu } from "@components/tredici";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteMenuItem = () => {
  return (
    <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />}>
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
