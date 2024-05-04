import { ContextMenu } from "@components/tredici";
import { ClipboardIcon } from "@radix-ui/react-icons";

const PasteMenuItem = () => {
  return <ContextMenu.Item leftIcon={<ClipboardIcon />}>Paste</ContextMenu.Item>;
};

export { PasteMenuItem };
