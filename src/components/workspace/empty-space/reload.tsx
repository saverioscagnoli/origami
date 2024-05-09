import { ContextMenu } from "@components/tredici";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadMenuItem = () => {
  return <ContextMenu.Item leftIcon={<ReloadIcon />}>Reload</ContextMenu.Item>;
};

export { ReloadMenuItem };
