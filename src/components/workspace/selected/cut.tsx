import { ContextMenu } from "@components/tredici";
import { ScissorsIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

const CutMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const setClipboard = useGlobalStates(state => state.setClipboard);

  const canCut = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    setClipboard({ entries: selected, cut: true });
  };

  return (
    <ContextMenu.Item
      leftIcon={<ScissorsIcon />}
      disabled={!canCut}
      onSelect={onSelect}
    >
      Cut
    </ContextMenu.Item>
  );
};

export { CutMenuItem };
