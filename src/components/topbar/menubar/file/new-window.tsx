import { Menubar } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";

const NewWindowMenuItem = () => {
  const onSelect = () => {
    invoke(CommandName.SpawnMainWindow);
  };

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
