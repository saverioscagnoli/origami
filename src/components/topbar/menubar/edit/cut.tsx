import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { ScissorsIcon } from "@radix-ui/react-icons";
import { useMemo } from "react";

const CutMenuItem = () => {
  const { selected } = useCurrentDir();
  const { setCutting } = useGlobalStates();

  const canCut = useMemo(() => selected.length > 0, [selected]);

  const onSelect = () => {
    setCutting(selected);
  };

  return (
    <Menubar.Item leftIcon={<ScissorsIcon />} disabled={!canCut} onSelect={onSelect}>
      Cut
    </Menubar.Item>
  );
};

export { CutMenuItem };
