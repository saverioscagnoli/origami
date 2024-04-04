import { useNavigation } from "@hooks/use-navigation";
import { FilePlusIcon } from "@radix-ui/react-icons";
import { Menubar } from "@tredici";

const NewFile = () => {
  const { createEntry } = useNavigation();

  return (
    <Menubar.Item leftIcon={<FilePlusIcon />} onClick={createEntry(false)}>
      New File
    </Menubar.Item>
  );
};

export { NewFile };
