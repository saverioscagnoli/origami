import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { ClipboardIcon } from "@radix-ui/react-icons";

const PasteMenuItem = () => {
  const { canPaste } = useGlobalStates();

  return (
    <ContextMenu.Item leftIcon={<ClipboardIcon />} disabled={!canPaste}>
      Paste
    </ContextMenu.Item>
  );
};

export { PasteMenuItem };
