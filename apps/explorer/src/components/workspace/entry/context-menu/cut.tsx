import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { ScissorsIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Cut = () => {
  const { clipboardEntries } = useGlobalStates();
  const { selected } = useCurrentDir();

  const [_, cutting] = clipboardEntries.get() ?? [null, false];

  const onCut = () => {
    if (cutting) {
      clipboardEntries.reset();
    } else {
      clipboardEntries.set([selected.get(), true]);
    }
  };

  return (
    <ContextMenu.Item leftIcon={<ScissorsIcon />} onClick={onCut}>
      {cutting ? "Stop Cutting" : "Cut"}
    </ContextMenu.Item>
  );
};

export { Cut };
