import { ContextMenu } from "@components/tredici";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  return <ContextMenu.Item leftIcon={<CopyIcon />}>Copy</ContextMenu.Item>;
};

export { CopyMenuItem };
