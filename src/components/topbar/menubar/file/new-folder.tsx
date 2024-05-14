import { FolderIcon } from "@components/icons";
import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@zustand/global-states-store";

const NewFolderMenuItem = () => {
  const setCreating = useGlobalStates(state => state.setCreating);

  const onSelect = () => {
    setCreating({ state: true, isDir: true });
  };

  return (
    <Menubar.Item leftIcon={<FolderIcon />} shortcut="Ctrl + Shift + N" onSelect={onSelect}>
      New Folder...
    </Menubar.Item>
  );
};

export { NewFolderMenuItem };
