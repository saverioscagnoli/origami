import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const FindInFolder = () => {
  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />}>Find in Folder</Menubar.Item>
  );
};

export { FindInFolder };
