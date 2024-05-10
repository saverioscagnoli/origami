import { ContextMenu } from "@components/tredici";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";
import { useCallstack } from "@zustand/callstack-store";
import { useCurrentDir } from "@zustand/curent-dir-store";
import { useGlobalStates } from "@zustand/global-state-store";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const push = useCallstack(state => state.push);
  const dir = useCurrentDir(state => state.dir);

  const [clipboard, setClipboard] = useGlobalStates(state => [
    state.clipboard,
    state.setClipboard
  ]);

  const canPaste = useMemo(() => clipboard.entries.length > 0, [clipboard.entries]);

  const onSelect = () => {
    const paths = clipboard.entries.map(e => e.path);
    push(CommandName.PasteEntries, { paths, dest: dir });
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
