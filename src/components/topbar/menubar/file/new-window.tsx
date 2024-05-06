import { Menubar } from "@components/tredici";
import { useCommands } from "@hooks/use-commands";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";

const NewWindowMenuItem = () => {
  const { createWindow } = useCommands();

  return (
    <Menubar.Item leftIcon={<OpenInNewWindowIcon />} onSelect={createWindow}>
      New Window
    </Menubar.Item>
  );
};

export { NewWindowMenuItem };
