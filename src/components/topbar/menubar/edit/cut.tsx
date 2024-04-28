import { Menubar } from "@components/tredici";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  return <Menubar.Item leftIcon={<ScissorsIcon />}>Cut</Menubar.Item>;
};

export { CutMenuItem };
