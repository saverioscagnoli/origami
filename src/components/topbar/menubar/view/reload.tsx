import { Menubar } from "@components/tredici";
import { useNavigation } from "@contexts/navigation";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadMenuItem = () => {
  const { reload } = useNavigation();

  return (
    <Menubar.Item leftIcon={<ReloadIcon />} onClick={reload}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
