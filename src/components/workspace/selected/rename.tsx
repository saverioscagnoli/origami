import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  const { selected } = useCurrentDir();

  const onClick = () => {
  };

  return (
    <ContextMenu.Item leftIcon={<Pencil1Icon />} onClick={onClick}>
      Rename
    </ContextMenu.Item>
  );
};

export { RenameMenuItem };
