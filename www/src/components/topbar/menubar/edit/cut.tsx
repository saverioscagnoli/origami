import { ScissorsIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

const CutMenuItem = () => {
  const selected = useCurrentDir(s => s.selected);
  const setClipboard = useStates(s => s.setClipboard);

  const canCut = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    setClipboard({ entries: selected, cut: true });
  };

  return (
    <Menubar.Item
      leftIcon={<ScissorsIcon />}
      shortcut="Ctrl + X"
      disabled={!canCut}
      onSelect={onSelect}
    >
      Cut
    </Menubar.Item>
  );
};

export { CutMenuItem };
