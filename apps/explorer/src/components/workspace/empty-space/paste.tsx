import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { useNavigation } from "@hooks/use-navigation";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const PasteMenuItem = () => {
  const { cutting, copying } = useGlobalStates();
  const { cutEntries, copyEntries } = useNavigation();

  const canPaste = useMemo(
    () => cutting() !== null || copying() !== null,
    [cutting(), copying()]
  );

  const cutOrCopy = () => {
    console.log(copying(), cutting());
    if (cutting() !== null) {
      cutEntries();
    } else {
      copyEntries();
    }
  };

  return (
    <ContextMenu.Item
      leftIcon={<ClipboardIcon />}
      disabled={!canPaste}
      onClick={cutOrCopy}
    >
      Paste
    </ContextMenu.Item>
  );
};

export { PasteMenuItem };
