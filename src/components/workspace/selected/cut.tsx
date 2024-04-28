import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";
import { useGlobalStates } from "@contexts/global-states";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  const { cutting, copying } = useGlobalStates();
  const { selected } = useCurrentDir();

  const startCutting = () => {
    copying.reset();
    cutting.set(selected());
  };

  return (
    <ContextMenu.Item leftIcon={<ScissorsIcon />} onClick={startCutting}>
      Cut
    </ContextMenu.Item>
  );
};

export { CutMenuItem };
