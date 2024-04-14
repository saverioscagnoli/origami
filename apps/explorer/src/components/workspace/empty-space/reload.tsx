import { ContextMenu } from "@components/tredici";
import { useNavigation } from "@hooks/use-navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadMenuItem = () => {
  const { reload } = useNavigation();

  return (
    <ContextMenu.Item leftIcon={<ReloadIcon />} onClick={reload}>
      Reload
    </ContextMenu.Item>
  );
};

export { ReloadMenuItem };
