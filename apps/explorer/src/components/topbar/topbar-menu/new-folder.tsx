import { useNavigation } from "@hooks/use-navigation";
import { Menubar } from "@tredici";
import { FolderIcon } from "@components/folder-icon";

const NewFolder = () => {
  const { createEntry } = useNavigation();

  return (
    <Menubar.Item leftIcon={<FolderIcon />} onClick={createEntry(true)}>
      New Folder
    </Menubar.Item>
  );
};

export { NewFolder };
