import { CopyIcon } from "@radix-ui/react-icons";
import React from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

const CopyMenuItem: React.FC = () => {
  const selected = useCurrentDir(s => s.selected);
  const setClipboard = useStates(s => s.setClipboard);

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
