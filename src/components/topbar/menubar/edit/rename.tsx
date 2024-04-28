import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useGlobalStates } from "@contexts/global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const RenameMenuItem = () => {
  const { selected } = useCurrentDir();
  const { renaming } = useGlobalStates();

  const isEmpty = useMemo(() => selected().length === 0, [selected()]);
  const isRenaming = useMemo(() => renaming() !== null, [renaming()]);

  return (
    <Menubar.Item leftIcon={<Pencil1Icon />} disabled={isEmpty || isRenaming}>
      Rename
    </Menubar.Item>
  );
};

export { RenameMenuItem };
