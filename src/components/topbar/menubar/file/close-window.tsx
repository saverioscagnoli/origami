import { Menubar } from "@components/tredici";
import { Cross1Icon } from "@radix-ui/react-icons";

const CloseWindowMenuItem = () => {
  return <Menubar.Item leftIcon={<Cross1Icon />}> Close Window</Menubar.Item>;
};

export { CloseWindowMenuItem };
