import { CopyIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

const CopyMenuItem = () => {
  const selected = useCurrentDir(s => s.selected);
  const setClipboard = useStates(s => s.setClipboard);

  const canCopy = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    setClipboard({ entries: selected, cut: false });
  };

  return (
    <Menubar.Item
      leftIcon={<CopyIcon />}
      shortcut="Ctrl + C"
      disabled={!canCopy}
      onSelect={onSelect}
    >
      Copy
    </Menubar.Item>
  );
};

export { CopyMenuItem };
