import { Menubar } from "@components/tredici";
import { invoke } from "@lib/mapped-invoke";
import { ExitIcon } from "@radix-ui/react-icons";
import { CommandName } from "@typings/enums";

const CloseAllWindowsMenuItem = () => {
  const onSelect = () => {
    invoke(CommandName.CloseAllWindows);
  };

  return (
    <Menubar.Item leftIcon={<ExitIcon />} colorScheme="red" onSelect={onSelect}>
      Close All Windows
    </Menubar.Item>
  );
};

export { CloseAllWindowsMenuItem };
