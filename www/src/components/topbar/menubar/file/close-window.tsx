import { Cross1Icon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { Quit } from "../../../../../wailsjs/runtime/runtime";

const CloseWindowMenuItem = () => {
  const onSelect = () => Quit();

  return (
    <Menubar.Item
      colorScheme="red"
      leftIcon={<Cross1Icon />}
      shortcut="Ctrl + Q"
      onSelect={onSelect}
    >
      Close Window
    </Menubar.Item>
  );
};

export { CloseWindowMenuItem };
