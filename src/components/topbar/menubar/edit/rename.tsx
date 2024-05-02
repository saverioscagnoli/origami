import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const RenameMenuItem = () => {
  const { selected } = useCurrentDir();
  const { renaming } = useGlobalStates();

  const isEmpty = useMemo(() => selected.length === 0, [selected]);
  const isMoreThanOne = useMemo(() => selected.length > 1, [selected]);
  const isRenaming = useMemo(() => renaming() !== null, [renaming()]);

  const onClick = () => {
    renaming.set(selected.at(0));
  }

  return (
    <Menubar.Item
      leftIcon={<Pencil1Icon />}
      disabled={isEmpty || isMoreThanOne || isRenaming}
      onClick={onClick}
    >
      Rename
    </Menubar.Item>
  );
};

export { RenameMenuItem };
