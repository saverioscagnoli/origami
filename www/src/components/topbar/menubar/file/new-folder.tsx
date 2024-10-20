import { FolderIcon } from "~/components/icons/folder";
import { Menubar } from "~/components/tredici";
import { useStates } from "~/zustand/states";

const NewFolderMenuItem = () => {
  const setCreating = useStates(s => s.setCreating);

  const onSelect = () => {
    setCreating({ state: true, isDir: true });
  };

  return (
    <Menubar.Item
      leftIcon={<FolderIcon />}
      shortcut="Ctrl + Shift + N"
      onSelect={onSelect}
    >
      New Folder...
    </Menubar.Item>
  );
};

export { NewFolderMenuItem };
