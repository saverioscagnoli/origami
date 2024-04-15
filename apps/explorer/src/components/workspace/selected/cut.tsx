import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
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
