import { TrashIcon } from "@radix-ui/react-icons";
import { DeleteEntries } from "@wails/methods/fs/Filesystem";
import { useMemo } from "react";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const DeleteMenuItem = () => {
  const [selected, setSelected] = useCurrentDir(s => [
    s.selected,
    s.setSelected
  ]);
  const canDelete = useMemo(() => selected.length > 0, [selected]);

  const onSelect = async () => {
    const paths = selected.map(entry => entry.Path);
    await DeleteEntries(paths);
    setSelected([]);
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
