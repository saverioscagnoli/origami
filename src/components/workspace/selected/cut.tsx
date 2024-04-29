import { ContextMenu } from "@components/tredici";
import { useNavigation } from "@contexts/navigation";
import { ScissorsIcon } from "@radix-ui/react-icons";

const CutMenuItem = () => {
  const { cutEntries } = useNavigation();

  return (
    <ContextMenu.Item leftIcon={<ScissorsIcon />} onClick={cutEntries}>
      Cut
    </ContextMenu.Item>
  );
};

export { CutMenuItem };
