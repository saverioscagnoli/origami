import { useGlobalStates } from "@hooks/use-global-states";
import { useNavigation } from "@hooks/use-navigation";
import { ClipboardIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";
import { useMemo } from "react";

const Paste = () => {
  const { clipboardEntries } = useGlobalStates();
  const { paste } = useNavigation();

  const disabled = useMemo(
    () => clipboardEntries.get() === null,
    [clipboardEntries.get()]
  );

  return (
    <ContextMenu.Item
      leftIcon={<ClipboardIcon />}
      disabled={disabled}
      onClick={paste}
    >
      Paste
    </ContextMenu.Item>
  );
};

export { Paste };
