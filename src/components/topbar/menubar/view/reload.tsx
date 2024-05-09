import { Menubar } from "@components/tredici";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadMenuItem = () => {
  return <Menubar.Item leftIcon={<ReloadIcon />}>Reload</Menubar.Item>;
};

export { ReloadMenuItem };
