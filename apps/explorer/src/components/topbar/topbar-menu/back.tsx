import { ArrowLeftIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const Back = () => {
  return <Menubar.Item leftIcon={<ArrowLeftIcon />}>Back</Menubar.Item>;
};

export { Back };
