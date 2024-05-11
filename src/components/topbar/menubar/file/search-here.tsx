import { Menubar } from "@components/tredici";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useGlobalStates } from "@zustand/global-states-store";

const SearchHereMenuItem = () => {
  const setSearching = useGlobalStates(state => state.setSearching);

  const onSelect = () => {
    setSearching({ state: true, where: "here" });
  };

  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />} onSelect={onSelect}>
      Search Here
    </Menubar.Item>
  );
};

export { SearchHereMenuItem };
