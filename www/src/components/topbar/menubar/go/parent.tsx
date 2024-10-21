import { ArrowUpIcon } from "@radix-ui/react-icons";
import { JoinPath } from "@wails/methods/utils/Utils";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const ParentDirectoryMenuItem = () => {
  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);

  const onSelect = async () => {
    const parentDir = await JoinPath([dir, ".."]);
    cd(parentDir);
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
