import { ContextMenu } from "@tredici";
import { TrashIcon } from "@radix-ui/react-icons";

const Delete = () => {
  return (
    <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />}>
      Delete
    </ContextMenu.Item>
  );
};

export { Delete };
