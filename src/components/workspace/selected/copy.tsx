import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { copying, cutting } = useGlobalStates();

  const onClick = () => {
    copying.set(selected);
    cutting.set([]);
  };

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onClick={onClick}>
      Copy
    </ContextMenu.Item>
  );
};

export { CopyMenuItem };
