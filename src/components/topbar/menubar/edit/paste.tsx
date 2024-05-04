import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";

import { ClipboardIcon } from "@radix-ui/react-icons";

const PasteMenuItem = () => {
  const { canPaste } = useGlobalStates();

  return (
    <Menubar.Item leftIcon={<ClipboardIcon />} disabled={!canPaste}>
      Paste
    </Menubar.Item>
  );
};

export { PasteMenuItem };
