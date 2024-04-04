import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { ScissorsIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Cut = () => {
  const { clipboardEntries } = useGlobalStates();
  const { selected } = useCurrentDir();

  const onCut = () => {
    clipboardEntries.set([selected.get(), true]);
  };

  return (
    <ContextMenu.Item leftIcon={<ScissorsIcon />} onClick={onCut}>
      Cut
    </ContextMenu.Item>
  );
};

export { Cut };
