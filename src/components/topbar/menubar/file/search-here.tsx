import { Menubar } from "@components/tredici";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useGlobalStates } from "@zustand/global-state-store";

const SearchHereMenuItem = () => {
  const setSearching = useGlobalStates(state => state.setSearching);

  const onSelect = () => {
    setSearching({ state: true });
  };

  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />} onSelect={onSelect}>
      Search Here
    </Menubar.Item>
  );
};

export { SearchHereMenuItem };
