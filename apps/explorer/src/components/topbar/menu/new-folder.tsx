import { FolderIcon } from "@components/folder-icon";
import { Menubar } from "@components/tredici";

const NewFolderMenuItem = () => {
  return <Menubar.Item leftIcon={<FolderIcon />}>New Folder</Menubar.Item>;
};

export { NewFolderMenuItem };
