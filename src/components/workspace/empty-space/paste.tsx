import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useNavigation } from "@contexts/navigation";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { pasteEntries } = useNavigation();
  const { cutting, copying } = useGlobalStates();

  const disabled = useMemo(
    () => cutting().length === 0 && copying().length === 0,
    [cutting(), copying()]
  );

  return (
    <ContextMenu.Item
      leftIcon={<ClipboardIcon />}
      disabled={disabled}
      onClick={pasteEntries}
    >
      Paste
    </ContextMenu.Item>
  );
};

export { PasteMenuItem };
