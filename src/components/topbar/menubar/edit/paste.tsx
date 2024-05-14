import { Menubar } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";

import { ClipboardIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-states-store";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const dir = useCurrentDir(state => state.dir);
  const [clipboard, setClipboard] = useGlobalStates(state => [
    state.clipboard,
    state.setClipboard
  ]);

  const canPaste = useMemo(() => clipboard.entries.length > 0, [clipboard]);

  const onSelect = () => {
    const paths = clipboard.entries.map(e => e.path);
    invoke(CommandName.PasteEntries, { paths, dest: dir, cut: clipboard.cut });
    setClipboard({ entries: [], cut: false });
  };

  return (
    <Menubar.Item
      leftIcon={<ClipboardIcon />}
      disabled={!canPaste}
      onSelect={onSelect}
    >
      Paste
    </Menubar.Item>
  );
};

export { PasteMenuItem };
