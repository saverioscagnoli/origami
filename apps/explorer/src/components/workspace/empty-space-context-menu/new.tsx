import { useNavigation } from "@hooks/use-navigation";
import { FilePlusIcon, PlusIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";
import { BsFolderFill } from "react-icons/bs";

const New = () => {
  const { createEntry } = useNavigation();

  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>New</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item leftIcon={<FilePlusIcon />} onClick={createEntry(false)}>
          File
        </ContextMenu.Item>
        <ContextMenu.Item leftIcon={<BsFolderFill />} onClick={createEntry(true)}>
          Folder
        </ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  );
};

export { New };
