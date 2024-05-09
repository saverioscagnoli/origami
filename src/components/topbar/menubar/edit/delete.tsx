import { Menubar } from "@components/tredici";
import { TrashIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useMemo } from "react";

const DeleteMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const push = useCallstack(state => state.push);

  const canDelete = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    const paths = selected.map(entry => entry.path);
    push(CommandName.DeleteEntries, { paths });
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
