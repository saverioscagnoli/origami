import { Menubar } from "@components/tredici";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";

const ReloadMenuItem = () => {
  const reload = useCurrentDir(state => state.reload);

  return (
    <Menubar.Item leftIcon={<ReloadIcon />} shortcut="Ctrl + R" onSelect={reload}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
