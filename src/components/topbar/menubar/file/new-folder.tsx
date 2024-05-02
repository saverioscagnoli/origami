import { FolderIcon } from "@components/icons";
import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";

const NewFolderMenuItem = () => {
  const { creating } = useGlobalStates();

  const onSelect = () => {
    creating.set({ state: true, isDir: true });
  };

  return (
    <Menubar.Item leftIcon={<FolderIcon />} onSelect={onSelect}>
      New Folder
    </Menubar.Item>
  );
};

export { NewFolderMenuItem };
