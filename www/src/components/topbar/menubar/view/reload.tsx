import { ReloadIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const ReloadMenuItem = () => {
  const [cd, dir] = useCurrentDir(s => [s.cd, s.dir]);

  const onSelect = () => {
    cd(dir);
  };

  return (
    <Menubar.Item
      leftIcon={<ReloadIcon />}
      shortcut="Ctrl + R"
      onSelect={onSelect}
    >
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
