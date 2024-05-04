import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { EnterIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const OpenMenuItem = () => {
  const { selected } = useCurrentDir();

  const paths = useMemo(() => selected.map(e => e.path), [selected]);
  const isDir = paths.length === 1 && selected.at(0).isDir;

  const onClick = () => {

  };

  return (
    <ContextMenu.Item leftIcon={<EnterIcon />} onClick={onClick}>
      Open
    </ContextMenu.Item>
  );
};

export { OpenMenuItem };
