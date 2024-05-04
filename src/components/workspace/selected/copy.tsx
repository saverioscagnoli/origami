import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { startCopying } = useGlobalStates();

  const onSelect = () => {
    startCopying(selected);
  };

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onSelect={onSelect}>
      Copy
    </ContextMenu.Item>
  );
};

export { CopyMenuItem };
