import { Menubar } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { getParentDir } from "@lib/utils";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";

const ParentDirectoryMenuItem = () => {
  const dir = useCurrentDir(state => state.dir);

  const onSelect = async () => {
    invoke(CommandName.ListDir, { dir: await getParentDir(dir) });
  };

  return (
    <Menubar.Item leftIcon={<ArrowUpIcon />} shortcut="Ctrl + Up" onSelect={onSelect}>
      Parent Directory
    </Menubar.Item>
  );
};

export { ParentDirectoryMenuItem };
