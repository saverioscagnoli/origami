import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useNavigation } from "@contexts/navigation";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const DeleteMenuItem = () => {
  const { selected } = useCurrentDir();
  const { deleteEntries } = useNavigation();

  const disabled = useMemo(() => selected().length === 0, [selected()]);

  return (
    <Menubar.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      disabled={disabled}
      onClick={deleteEntries}
    >
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };
