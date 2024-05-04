import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { Pencil1Icon } from "@radix-ui/react-icons";

const RenameMenuItem = () => {
  const { canRename } = useGlobalStates();

  return (
    <Menubar.Item leftIcon={<Pencil1Icon />} disabled={!canRename}>
      Rename
    </Menubar.Item>
  );
};

export { RenameMenuItem };
