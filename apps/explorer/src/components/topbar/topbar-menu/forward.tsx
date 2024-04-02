import { ArrowRightIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const Forward = () => {
  return <Menubar.Item leftIcon={<ArrowRightIcon />}>Forward</Menubar.Item>;
};

export { Forward };
