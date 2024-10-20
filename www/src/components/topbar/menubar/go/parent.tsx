import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const ParentDirectoryMenuItem = () => {
  const dir = useCurrentDir(s => s.dir);

  const onSelect = async () => {};

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
