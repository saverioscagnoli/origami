import { Menubar } from "@components/tredici";
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";

const NewWindowMenuItem = () => {
  return (
    <Menubar.Item leftIcon={<OpenInNewWindowIcon />}>New Window</Menubar.Item>
  );
};

export { NewWindowMenuItem };
