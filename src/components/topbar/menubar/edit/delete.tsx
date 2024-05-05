import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const DeleteMenuItem = () => {
  const { selected } = useCurrentDir();

  const canDelete = useMemo(() => selected.length > 0, [selected]);

  return (
    <Menubar.Item colorScheme="red" leftIcon={<TrashIcon />} disabled={!canDelete}>
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };
