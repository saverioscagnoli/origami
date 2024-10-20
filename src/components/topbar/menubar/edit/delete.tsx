import { Menubar } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { TrashIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const DeleteMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);

  const canDelete = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    const paths = selected.map(entry => entry.path);
    invoke(CommandName.DeleteEntries, { paths });
  };

  return (
    <Menubar.Item
      colorScheme="red"
      leftIcon={<TrashIcon />}
      shortcut="Delete"
      disabled={!canDelete}
      onSelect={onSelect}
    >
      Delete
    </Menubar.Item>
  );
};

export { DeleteMenuItem };
