import { Menubar } from "@components/tredici";
import { FilePlusIcon } from "@radix-ui/react-icons";

const NewFileMenuItem = () => {
  return <Menubar.Item leftIcon={<FilePlusIcon />}>New File...</Menubar.Item>;
};

export { NewFileMenuItem };
