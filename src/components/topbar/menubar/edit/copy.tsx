import { Menubar } from "@components/tredici";
import { CopyIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

const CopyMenuItem = () => {
  const selected = useCurrentDir(state => state.selected);
  const setClipboard = useGlobalStates(state => state.setClipboard);

  const canCopy = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    setClipboard({ entries: selected, cut: false });
  };

  return (
    <Menubar.Item leftIcon={<CopyIcon />} disabled={!canCopy} onSelect={onSelect}>
      Copy
    </Menubar.Item>
  );
};

export { CopyMenuItem };
