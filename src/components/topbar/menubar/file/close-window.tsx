import { Menubar } from "@components/tredici";
import { Cross1Icon } from "@radix-ui/react-icons";
import { getCurrent } from "@tauri-apps/api/window";

const CloseWindowMenuItem = () => {
  const win = getCurrent();

  const onSelect = () => win.close();

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
