import { Menubar } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { ExitIcon } from "@radix-ui/react-icons";

const CloseAllWindowsMenuItem = () => {
  const { closeAllWindows } = useCommands();

  return (
    <Menubar.Item leftIcon={<ExitIcon />} colorScheme="red" onSelect={closeAllWindows}>
      Close All Windows
    </Menubar.Item>
  );
};

export { CloseAllWindowsMenuItem };
