import { Menubar } from "@components/tredici";
import { ArrowRightIcon } from "@radix-ui/react-icons";

const ForwardMenuItem = () => {
  return <Menubar.Item leftIcon={<ArrowRightIcon />}>Forward</Menubar.Item>;
};

export { ForwardMenuItem };
