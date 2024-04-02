import { FilePlusIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const NewFile = () => {
  return <Menubar.Item leftIcon={<FilePlusIcon />}>New File</Menubar.Item>;
};

export { NewFile };
