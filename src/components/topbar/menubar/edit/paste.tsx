import { Menubar } from "@components/tredici";

import { ClipboardIcon } from "@radix-ui/react-icons";

const PasteMenuItem = () => {
  return <Menubar.Item leftIcon={<ClipboardIcon />}>Paste</Menubar.Item>;
};

export { PasteMenuItem };
