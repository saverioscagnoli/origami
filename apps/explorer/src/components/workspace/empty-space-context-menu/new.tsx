import { FilePlusIcon, PlusIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";
import { BsFolderFill } from "react-icons/bs";

const New = () => {
  return (
    <ContextMenu.Sub>
      <ContextMenu.SubTrigger leftIcon={<PlusIcon />}>New</ContextMenu.SubTrigger>
      <ContextMenu.SubContent>
        <ContextMenu.Item leftIcon={<FilePlusIcon />}>File</ContextMenu.Item>
        <ContextMenu.Item leftIcon={<BsFolderFill />}>Folder</ContextMenu.Item>
      </ContextMenu.SubContent>
    </ContextMenu.Sub>
  );
};

export { New };
