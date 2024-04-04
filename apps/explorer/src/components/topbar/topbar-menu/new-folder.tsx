import { useNavigation } from "@hooks/use-navigation";
import { PlusIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const NewFolder = () => {
  const { createEntry } = useNavigation();

  return (
    <Menubar.Item leftIcon={<PlusIcon />} onClick={createEntry(true)}>
      New Folder
    </Menubar.Item>
  );
};

export { NewFolder };
