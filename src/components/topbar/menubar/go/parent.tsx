import { Menubar } from "@components/tredici";
import { getParentDir } from "@lib/utils";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";

const ParentDirectoryMenuItem = () => {
  const [dir, cd] = useCurrentDir(state => [state.dir, state.cd]);

  const onSelect = async () => {
    const path = await getParentDir(dir);
    cd(path);
  };

  return (
    <Menubar.Item
      leftIcon={<ArrowUpIcon />}
      shortcut="Ctrl + Up"
      onSelect={onSelect}
    >
      Parent Directory
    </Menubar.Item>
  );
};

export { ParentDirectoryMenuItem };
