import { ContextMenu } from "@components/tredici";
import { useDispatchers } from "@hooks/use-dispatchers";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadMenuItem = () => {
  const { reload } = useDispatchers();

  return (
    <ContextMenu.Item leftIcon={<ReloadIcon />} onClick={reload}>
      Reload
    </ContextMenu.Item>
  );
};

export { ReloadMenuItem };
