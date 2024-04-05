import { useCurrentDir } from "@hooks/use-current-dir";
import { useGlobalStates } from "@hooks/use-global-states";
import { CopyIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Copy = () => {
  const { clipboardEntries } = useGlobalStates();
  const { selected } = useCurrentDir();

  const onCopy = () => {
    clipboardEntries.set([selected.get(), false]);
  };

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onClick={onCopy}>
      Copy
    </ContextMenu.Item>
  );
};

export { Copy };
