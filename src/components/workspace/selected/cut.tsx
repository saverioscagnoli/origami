import { ContextMenu } from "@components/tredici";
import { useGlobalStates } from "@contexts/global-states";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  const { selected } = useCurrentDir();
  const { copying, cutting } = useGlobalStates();

  const onClick = () => {
    cutting.set(selected);
    copying.set([]);
  };

  return (
    <ContextMenu.Item leftIcon={<ScissorsIcon />} onClick={onClick}>
      Cut
    </ContextMenu.Item>
  );
};

export { CutMenuItem };
