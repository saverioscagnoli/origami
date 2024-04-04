import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Rename = () => {
  const { selected } = useCurrentDir();
  const { renaming } = useGlobalStates();

  const onRename = () => {
    const entry = selected.get().at(0);
    renaming.set(entry);
  };

  return (
    <ContextMenu.Item leftIcon={<Pencil1Icon />} onClick={onRename}>
      Rename
    </ContextMenu.Item>
  );
};

export { Rename };
