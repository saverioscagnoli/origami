import { Menubar } from "@components/tredici";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  return <Menubar.Item leftIcon={<Pencil1Icon />}>Rename</Menubar.Item>;
};

export { RenameMenuItem };
