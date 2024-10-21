import { ScissorsIcon } from "@radix-ui/react-icons";
import React, { useMemo } from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

const CutMenuItem: React.FC = () => {
  const selected = useCurrentDir(s => s.selected);
  const setClipboard = useStates(s => s.setClipboard);

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
