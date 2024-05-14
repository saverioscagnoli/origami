import { ContextMenu } from "@components/tredici";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  return <ContextMenu.Item leftIcon={<ScissorsIcon />}>Cut</ContextMenu.Item>;
};

export { CutMenuItem };
