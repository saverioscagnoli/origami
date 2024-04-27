import { Menubar } from "@components/tredici";
import { ExitIcon } from "@radix-ui/react-icons";

const CloseAllWindowsMenuItem = () => {
  return (
    <Menubar.Item leftIcon={<ExitIcon />} colorScheme="red">
      Close All Windows
    </Menubar.Item>
  );
};

export { CloseAllWindowsMenuItem };
