import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";
import { useStates } from "~/zustand/states";

const SearchHereMenuItem = () => {
  const setSearching = useStates(s => s.setSearching);

  const onSelect = () => {
    setSearching({ state: true, where: "here" });
  };

  return (
    <Menubar.Item
      leftIcon={<MagnifyingGlassIcon />}
      shortcut="Ctrl + F"
      onSelect={onSelect}
    >
      Search Here
    </Menubar.Item>
  );
};

export { SearchHereMenuItem };
