import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useDispatchers } from "@hooks/use-dispatchers";
import { EnterIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const OpenMenuItem = () => {
  const { cd, open } = useDispatchers();
  const { selected } = useCurrentDir();

  const paths = useMemo(() => selected.map(e => e.path), [selected]);
  const isDir = paths.length === 1 && selected.at(0).isDir;

  const onClick = () => {
    if (isDir) {
      cd(paths.at(0))();
    } else {
      open(paths.at(0))();
    }
  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onClick={onClick}>
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
