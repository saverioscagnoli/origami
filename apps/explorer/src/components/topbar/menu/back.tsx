import { Menubar } from "@components/tredici";
import { ArrowLeftIcon } from "@radix-ui/react-icons";

const BackMenuItem = () => {
  return <Menubar.Item leftIcon={<ArrowLeftIcon />}> Back</Menubar.Item>;
};

export { BackMenuItem };
