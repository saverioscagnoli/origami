import { PlusIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const NewFolder = () => {
  return <Menubar.Item leftIcon={<PlusIcon />}>New Folder</Menubar.Item>;
};

export { NewFolder };
