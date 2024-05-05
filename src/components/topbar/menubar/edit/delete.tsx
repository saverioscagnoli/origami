import { Menubar } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { TrashIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const DeleteMenuItem = () => {
  const { deleteEntries } = useCommands();
  const { selected } = useCurrentDir();

  const canDelete = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    const paths = selected.map(e => e.path);
    deleteEntries(paths);
  };

  return (
    <Menubar.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      disabled={!canDelete}
      onSelect={onSelect}
    >
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };
