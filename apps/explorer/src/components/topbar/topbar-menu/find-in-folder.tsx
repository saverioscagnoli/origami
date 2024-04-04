import { useGlobalStates } from "@hooks/use-global-states";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const FindInFolder = () => {
  const { searching } = useGlobalStates();

  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />} onClick={searching.toggle}>
      Find in Folder
    </Menubar.Item>
  );
};

export { FindInFolder };
