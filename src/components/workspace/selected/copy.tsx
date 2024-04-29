import { ContextMenu } from "@components/tredici";
import { useNavigation } from "@contexts/navigation";
import { CopyIcon } from "@radix-ui/react-icons";

const CopyMenuItem = () => {
  const { copyEntries } = useNavigation();

  return (
    <ContextMenu.Item leftIcon={<CopyIcon />} onClick={copyEntries}>
      Copy
    </ContextMenu.Item>
  );
};

export { CopyMenuItem };
