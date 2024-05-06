import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  const { selected } = useCurrentDir();
  const { setRenaming } = useGlobalStates();

  const onSelect = () => {
    setRenaming(selected.at(0));
  };

  return (
    <ContextMenu.Item leftIcon={<Pencil1Icon />} onSelect={onSelect}>
      Rename
    </ContextMenu.Item>
  );
};

export { RenameMenuItem };
