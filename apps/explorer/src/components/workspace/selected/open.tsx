import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useNavigation } from "@hooks/use-navigation";
import { EnterIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const OpenMenuItem = () => {
  const { selected } = useCurrentDir();
  const { cd, openFile } = useNavigation();

  const paths = useMemo(() => Array.from(selected().keys()), [selected()]);
  const isDir = paths.length === 1 && selected().get(paths[0]).isDir;

  return (
    <ContextMenu.Item
      leftIcon={<EnterIcon />}
      onClick={isDir ? cd(paths[0]) : openFile(paths)}
    >
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
