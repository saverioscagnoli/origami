import { Menubar } from "@components/tredici";
import { FileIcon } from "@radix-ui/react-icons";

const NewFileMenuItem = () => {
  return <Menubar.Item leftIcon={<FileIcon />}>New File</Menubar.Item>;
};

export { NewFileMenuItem };
