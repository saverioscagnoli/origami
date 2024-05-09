import { ContextMenu } from "@components/tredici";
import { TrashIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";

const DeleteMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const push = useCallstack(state => state.push);

  const onSelect = () => {
    const paths = selected.map(entry => entry.path);
    push(CommandName.DeleteEntries, { paths });
  };

  return (
    <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />} onSelect={onSelect}>
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
