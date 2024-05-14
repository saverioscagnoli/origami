import { Menubar } from "@components/tredici";
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
    <Menubar.Item leftIcon={<ReloadIcon />} shortcut="Ctrl + R" onSelect={onSelect}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
