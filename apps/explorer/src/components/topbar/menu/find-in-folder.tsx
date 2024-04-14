import { Menubar } from "@components/tredici";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const FindInFolderMenuItem = () => {
  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />}>Find in Folder</Menubar.Item>
  );
};

export { FindInFolderMenuItem };
