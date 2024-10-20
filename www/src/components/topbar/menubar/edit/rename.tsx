import { Pencil1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Menubar } from "~/components/tredici";
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
    <Menubar.Item
      leftIcon={<Pencil1Icon />}
      shortcut="F2"
      disabled={!canRename}
      onSelect={onSelect}
    >
      Rename
    </Menubar.Item>
  );
};

export { RenameMenuItem };
