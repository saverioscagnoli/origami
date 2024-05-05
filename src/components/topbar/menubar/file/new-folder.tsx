import { FolderIcon } from "@components/icons";
import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";

const NewFolderMenuItem = () => {
  const { setCreating } = useGlobalStates();

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
