import { Pencil1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

const RenameMenuItem = () => {
  const selected = useCurrentDir(s => s.selected);
  const setRenaming = useStates(s => s.setRenaming);

  const canRename = useMemo(() => selected.length === 1, [selected]);

  const onSelect = () => {
    setRenaming(selected.at(0)!);
  };

  return (
    <ContextMenu.Item
      leftIcon={<Pencil1Icon />}
      disabled={!canRename}
      onSelect={onSelect}
    >
      Rename
    </ContextMenu.Item>
  );
};

export { RenameMenuItem };
