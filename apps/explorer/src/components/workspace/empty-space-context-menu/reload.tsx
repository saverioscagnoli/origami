import { useNavigation } from "@hooks/use-navigation";
import { ReloadIcon } from "@radix-ui/react-icons";
import { ContextMenu } from "@tredici";

const Reload = () => {
  const { reload } = useNavigation();

  return (
    <ContextMenu.Item leftIcon={<ReloadIcon />} onClick={reload}>
      Reload
    </ContextMenu.Item>
  );
};

export { Reload };
