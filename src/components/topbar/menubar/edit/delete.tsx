import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const DeleteMenuItem = () => {
  const { selected } = useCurrentDir();
  const { deleteEntries } = useDispatchers();

  const disabled = useMemo(() => selected.length === 0, [selected]);

  return (
    <Menubar.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      disabled={disabled}
      onSelect={deleteEntries}
    >
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };

