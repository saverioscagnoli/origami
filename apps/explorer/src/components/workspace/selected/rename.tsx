import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  const { renaming } = useGlobalStates();
  const { selected } = useCurrentDir();

  const onClick = () => {
    const [path, name] = selected().getKeyValues()[0];
    renaming.set([path, name]);
  };

  return (
    <ContextMenu.Item leftIcon={<Pencil1Icon />} onClick={onClick}>
      Rename
    </ContextMenu.Item>
  );
};

export { RenameMenuItem };
