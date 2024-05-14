import { ContextMenu } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { ReloadIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

const ReloadMenuItem = () => {
  const dir = useCurrentDir(state => state.dir);

  const onSelect = () => {
    invoke(CommandName.ListDir, { dir });
  };

  return (
    <ContextMenu.Item leftIcon={<ReloadIcon />} onSelect={onSelect}>
      Reload
    </ContextMenu.Item>
  );
};

export { ReloadMenuItem };
