import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useGlobalStates } from "@contexts/global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  const { renaming } = useGlobalStates();
  const { selected } = useCurrentDir();

  const onClick = () => {
    renaming.set(selected().at(0));
  };

  return (
    <ContextMenu.Item leftIcon={<Pencil1Icon />} onClick={onClick}>
      Rename
    </ContextMenu.Item>
  );
};

export { RenameMenuItem };
