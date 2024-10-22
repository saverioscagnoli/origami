import { ClipboardIcon } from "@radix-ui/react-icons";
import { PasteEntries } from "@wails/methods/fs/Filesystem";
import React, { useMemo } from "react";
import { ContextMenu } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";
import { useStates } from "~/zustand/states";

const PasteMenuItem: React.FC = () => {
  const dir = useCurrentDir(s => s.dir);
  const [clipboard, setClipboard] = useStates(s => [
    s.clipboard,
    s.setClipboard
  ]);

  const canPaste = useMemo(() => clipboard.entries.length > 0, [clipboard]);

  const onSelect = () => {
    PasteEntries(clipboard.entries, dir, clipboard.cut);
    setClipboard({ entries: [], cut: false });
  };

  return (
    <ContextMenu.Item
      leftIcon={<ClipboardIcon />}
      disabled={!canPaste}
      onSelect={onSelect}
    >
      Paste
    </ContextMenu.Item>
  );
};

export { PasteMenuItem };
