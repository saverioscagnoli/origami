import React from "react";
import { FolderIcon } from "~/components/icons";
import { Menubar } from "~/components/tredici";

const NewFolderItem: React.FC = () => {
  return <Menubar.Item leftIcon={<FolderIcon />}>New Folder</Menubar.Item>;
};

export { NewFolderItem };
