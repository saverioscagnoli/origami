import { ContextMenu } from "@components/tredici";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  return <ContextMenu.Item leftIcon={<Pencil1Icon />}>Rename</ContextMenu.Item>;
};

export { RenameMenuItem };
