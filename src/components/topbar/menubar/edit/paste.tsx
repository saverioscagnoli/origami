import { Menubar } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";

import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { copying, cutting } = useGlobalStates();
  const { pasteEntries } = useCommands();
  const { dir } = useCurrentDir();

  const canPaste = useMemo(
    () => copying.length > 0 || cutting.length > 0,
    [copying, cutting]
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
