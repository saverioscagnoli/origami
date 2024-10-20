import { ExitIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";

const CloseAllWindowsMenuItem = () => {
  const onSelect = () => {};

  return (
    <Menubar.Item
      leftIcon={<ExitIcon />}
      colorScheme="red"
      shortcut="Ctrl + Shift + Q"
      onSelect={onSelect}
    >
      Close All Windows
    </Menubar.Item>
  );
};

export { CloseAllWindowsMenuItem };
