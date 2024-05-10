import { ContextMenu } from "@components/tredici";
import { CopyIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";

const CopyMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const setClipboard = useGlobalStates(state => state.setClipboard);

  const onSelect = () => {
    setClipboard({ entries: selected, cut: false });
  };

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onSelect={onSelect}>
      Copy
    </ContextMenu.Item>
  );
};

export { CopyMenuItem };
