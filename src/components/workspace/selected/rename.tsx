import { ContextMenu } from "@components/tredici";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

const RenameMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const setRenaming = useGlobalStates(state => state.setRenaming);

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
