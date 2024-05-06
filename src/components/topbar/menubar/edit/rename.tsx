import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const RenameMenuItem = () => {
  const { setRenaming } = useGlobalStates();
  const { selected } = useCurrentDir();

  const canRename = useMemo(() => selected.length === 1, [selected]);

  const onSelect = () => {
    setRenaming(selected.at(0));
  };

  return (
    <Menubar.Item
      leftIcon={<Pencil1Icon />}
      disabled={!canRename}
      onSelect={onSelect}
    >
      Rename
    </Menubar.Item>
  );
};

export { RenameMenuItem };
