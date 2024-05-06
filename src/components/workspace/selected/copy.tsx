import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { setCopying } = useGlobalStates();

  const onSelect = () => {
    setCopying(selected);
  };

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onSelect={onSelect}>
      Copy
    </ContextMenu.Item>
  );
};

export { CopyMenuItem };
