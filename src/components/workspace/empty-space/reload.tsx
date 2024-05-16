import { ContextMenu } from "@components/tredici";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";

const ReloadMenuItem = () => {
  const reload = useCurrentDir(state => state.reload);

  return (
    <ContextMenu.Item leftIcon={<ReloadIcon />} onSelect={reload}>
      Reload
    </ContextMenu.Item>
  );
};

export { ReloadMenuItem };
