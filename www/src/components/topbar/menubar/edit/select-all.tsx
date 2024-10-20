import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { useCurrentDir } from "~/zustand/dir";

const SelectAllMenuItem = () => {
  const [entries, setSelected] = useCurrentDir(s => [s.entries, s.setSelected]);

  const onSelect = () => setSelected(entries);

  return (
    <Menubar.Item
      leftIcon={<ArrowUpIcon />}
      shortcut="Ctrl + A"
      onSelect={onSelect}
    >
      Select All
    </Menubar.Item>
  );
};

export { SelectAllMenuItem };
