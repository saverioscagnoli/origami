import { Menubar } from "@components/tredici";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const SelectAllMenuItem = () => {
  return <Menubar.Item leftIcon={<ArrowUpIcon />}>Select All</Menubar.Item>;
};

export { SelectAllMenuItem };
