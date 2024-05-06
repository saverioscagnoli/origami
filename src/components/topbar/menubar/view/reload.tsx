import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ReloadIcon } from "@radix-ui/react-icons";

const ReloadMenuItem = () => {
  const { reload } = useCurrentDir();

  return (
    <Menubar.Item leftIcon={<ReloadIcon />} onSelect={reload}>
      Reload
    </Menubar.Item>
  );
};

export { ReloadMenuItem };
