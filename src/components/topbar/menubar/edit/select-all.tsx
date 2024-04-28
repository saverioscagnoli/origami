import { Menubar } from "@components/tredici";
import { useCurrentDir } from "@contexts/current-dir";

const SelectAllMenuItem = () => {
  const { entries, selected } = useCurrentDir();

  const selectAll = () => {
    selected.set(entries());
  };

  return <Menubar.Item onClick={selectAll}>Select All</Menubar.Item>;
};

export { SelectAllMenuItem };
