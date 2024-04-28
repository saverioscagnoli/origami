import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useNavigation } from "@contexts/navigation";
import { EnterIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const OpenMenuItem = () => {
  const { selected } = useCurrentDir();
  const { cd, openFiles } = useNavigation();

  const paths = useMemo(() => selected().map(e => e.path), [selected()]);
  const isDir = paths.length === 1 && selected()[0].isDir;

  return (
    <ContextMenu.Item
      leftIcon={<EnterIcon />}
      onClick={isDir ? cd(paths[0]) : openFiles(paths)}
    >
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
