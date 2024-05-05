import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";

import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { copying, cutting } = useGlobalStates();

  const canPaste = useMemo(
    () => copying.length > 0 || cutting.length > 0,
    [copying, cutting]
  );

  return (
    <Menubar.Item leftIcon={<ClipboardIcon />} disabled={!canPaste}>
      Paste
    </Menubar.Item>
  );
};

export { PasteMenuItem };
