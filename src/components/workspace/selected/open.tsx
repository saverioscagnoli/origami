import { ContextMenu } from "@components/tredici";
import { EnterIcon } from "@radix-ui/react-icons";

const OpenMenuItem = () => {
  return <ContextMenu.Item leftIcon={<EnterIcon />}>Open</ContextMenu.Item>;
};

export { OpenMenuItem };
