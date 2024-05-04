import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { selected } = useCurrentDir();
  const { canCopy, startCopying } = useGlobalStates();

  const onSelect = () => {
    startCopying(selected);
  };

  return (
    <Menubar.Item leftIcon={<CopyIcon />} disabled={!canCopy} onSelect={onSelect}>
      Copy
    </Menubar.Item>
  );
};

export { CopyMenuItem };
