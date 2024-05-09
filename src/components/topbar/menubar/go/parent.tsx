import { Menubar } from "@components/tredici";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const ParentDirectoryMenuItem = () => {
  return <Menubar.Item leftIcon={<ArrowUpIcon />}>Parent Directory</Menubar.Item>;
};

export { ParentDirectoryMenuItem };
