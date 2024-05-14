import { ContextMenu } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { TrashIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

const DeleteMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);

  const onSelect = () => {
    const paths = selected.map(entry => entry.path);
    invoke(CommandName.DeleteEntries, { paths });
  };

  return (
    <ContextMenu.Item colorScheme="red" leftIcon={<TrashIcon />} onSelect={onSelect}>
      Delete
    </ContextMenu.Item>
  );
};

export { DeleteMenuItem };
