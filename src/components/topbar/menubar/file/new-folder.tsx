import { FolderIcon } from "@components/icons";
import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@zustand/global-state-store";

const NewFolderMenuItem = () => {
  const setCreating = useGlobalStates(state => state.setCreating);

  const onSelect = () => {
    setCreating({ state: true, isDir: true });
  };

  return (
    <Menubar.Item leftIcon={<FolderIcon />} onSelect={onSelect}>
      New Folder...
    </Menubar.Item>
  );
};

export { NewFolderMenuItem };
