import { FolderIcon } from "@components/icons";
import { Menubar } from "@components/tredici";

const NewFolderMenuItem = () => {
  return <Menubar.Item leftIcon={<FolderIcon />}>New Folder</Menubar.Item>;
};

export { NewFolderMenuItem };
