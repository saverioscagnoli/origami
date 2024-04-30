import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";
import { RootState } from "@redux/store";
import { useMemo } from "react";
import { useSelector } from "react-redux";

const RenameMenuItem = () => {
  const { selected } = useSelector((state: RootState) => state.currentDir);
  const { renaming } = useGlobalStates();

  const isEmpty = useMemo(() => selected.length === 0, [selected]);
  const isRenaming = useMemo(() => renaming() !== null, [renaming()]);

  return (
    <Menubar.Item leftIcon={<Pencil1Icon />} disabled={isEmpty || isRenaming}>
      Rename
    </Menubar.Item>
  );
};

export { RenameMenuItem };
