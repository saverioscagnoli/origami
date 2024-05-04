import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { TrashIcon } from "@radix-ui/react-icons";

const DeleteMenuItem = () => {
  const { canDelete } = useGlobalStates();

  return (
    <Menubar.Item colorScheme="red" leftIcon={<TrashIcon />} disabled={!canDelete}>
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };
