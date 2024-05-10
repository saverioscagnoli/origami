import { Menubar } from "@components/tredici";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { useCurrentDir } from "@zustand/curent-dir-store";

const SelectAllMenuItem = () => {
  const [entries, replaceSelected] = useCurrentDir(state => [
    state.entries,
    state.replaceSelected
  ]);

  const onSelect = () => {
    replaceSelected(entries);
  };

  return (
    <Menubar.Item leftIcon={<ArrowUpIcon />} onSelect={onSelect}>
      Select All
    </Menubar.Item>
  );
};

export { SelectAllMenuItem };
