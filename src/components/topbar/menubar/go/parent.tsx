import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const ParentDirectoryMenuItem = () => {
  const { goToParent } = useCurrentDir();

  return (
    <Menubar.Item leftIcon={<ArrowUpIcon />} onSelect={goToParent}>
      Parent Directory
    </Menubar.Item>
  );
};

export { ParentDirectoryMenuItem };
