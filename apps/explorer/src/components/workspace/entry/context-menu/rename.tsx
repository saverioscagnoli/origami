import { Pencil1Icon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Rename = () => {
  return <ContextMenu.Item leftIcon={<Pencil1Icon />}>Rename</ContextMenu.Item>;
};

export { Rename };
