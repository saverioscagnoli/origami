import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";

const NewWindowMenuItem = () => {
  const onSelect = () => {};

  return (
    <Menubar.Item
      leftIcon={<OpenInNewWindowIcon />}
      shortcut="Ctrl + Shift + W"
      onSelect={onSelect}
    >
      New Window
    </Menubar.Item>
  );
};

export { NewWindowMenuItem };
