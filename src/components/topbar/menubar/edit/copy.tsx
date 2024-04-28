import { Menubar } from "@components/tredici";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  return <Menubar.Item leftIcon={<CopyIcon />}>Copy</Menubar.Item>;
};

export { CopyMenuItem };
