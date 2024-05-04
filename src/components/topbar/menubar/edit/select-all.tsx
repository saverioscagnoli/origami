import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@hooks/use-current-dir";
import { ArrowUpIcon } from "@radix-ui/react-icons";

const SelectAllMenuItem = () => {
  const { entries, replaceSelected } = useCurrentDir();

  const onSelect = () => {
    replaceSelected(entries);
  };

  return (
    <Menubar.Item leftIcon={<ArrowUpIcon />} onClick={onSelect}>
      Select All
    </Menubar.Item>
  );
};

export { SelectAllMenuItem };
