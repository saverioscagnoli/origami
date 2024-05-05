import { Menubar } from "@components/tredici";
import { useGlobalStates } from "@hooks/use-global-states";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchHereMenuItem = () => {
  const { setSearching } = useGlobalStates();

  const onSelect = () => {
    
    setSearching({ state: true, where: "here", query: "" });
  };

  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />} onSelect={onSelect}>
      Search Here
    </Menubar.Item>
  );
};

export { SearchHereMenuItem };
