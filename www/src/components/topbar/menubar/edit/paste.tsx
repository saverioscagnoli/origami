import { ClipboardIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";

const PasteMenuItem = () => {
  const onSelect = () => {};

  return (
    <Menubar.Item
      leftIcon={<ClipboardIcon />}
      shortcut="Ctrl + V"
      //disabled={!canPaste}
      onSelect={onSelect}
    >
      Paste
    </Menubar.Item>
  );
};

export { PasteMenuItem };
