import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { EnterIcon } from "@radix-ui/react-icons";

const OpenMenuItem = () => {
  const { selected, cd, openFiles } = useCurrentDir();

  const onSelect = () => {
    if (selected.at(0).isDir) {
      cd(selected.at(0).path);
    } else {
      openFiles(selected.map(e => e.path));
    }
  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onSelect={onSelect}>
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
