import { ContextMenu } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  const { selected } = useCurrentDir();
  const { startCutting } = useGlobalStates();

  const onSelect = () => {
    startCutting(selected);
  };

  return (
    <ContextMenu.Item leftIcon={<ScissorsIcon />} onSelect={onSelect}>
      Cut
    </ContextMenu.Item>
  );
};

export { CutMenuItem };
