import { Menubar } from "@components/tredici";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteMenuItem = () => {
  return (
    <Menubar.Item colorScheme="red" leftIcon={<TrashIcon />}>
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };
