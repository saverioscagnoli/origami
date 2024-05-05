import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { cutting, copying } = useGlobalStates();

  const canPaste = useMemo(
    () => cutting.length > 0 || copying.length > 0,
    [cutting, copying]
  );

  return (
    <ContextMenu.Item leftIcon={<ClipboardIcon />} disabled={!canPaste}>
      Paste
    </ContextMenu.Item>
  );
};

export { PasteMenuItem };
