import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  const { selected } = useCurrentDir();
  const { canCut, startCutting } = useGlobalStates();

  const onSelect = () => {
    startCutting(selected);
  };

  return (
    <Menubar.Item leftIcon={<ScissorsIcon />} disabled={!canCut} onSelect={onSelect}>
      Cut
    </Menubar.Item>
  );
};

export { CutMenuItem };
