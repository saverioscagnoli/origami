import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useGlobalStates } from "@contexts/global-states";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { cutting, copying } = useGlobalStates();
  const { selected } = useCurrentDir();

  const startCopying = () => {
    cutting.reset();
    copying.set(selected());
  };

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onClick={startCopying}>
      Copy
    </ContextMenu.Item>
  );
};

export { CopyMenuItem };
