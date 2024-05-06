import { ContextMenu } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { cutting, copying } = useGlobalStates();
  const { pasteEntries } = useCommands();
  const { dir } = useCurrentDir();

  const canPaste = useMemo(
    () => cutting.length > 0 || copying.length > 0,
    [cutting, copying]
  );

  const onSelect = () => {
    let paths: string[];
    let isCutting = false;

    if (cutting.length > 0) {
      paths = cutting.map(e => e.path);
      isCutting = true;
    } else {
      paths = copying.map(e => e.path);
    }

    pasteEntries(paths, dir, isCutting);
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
