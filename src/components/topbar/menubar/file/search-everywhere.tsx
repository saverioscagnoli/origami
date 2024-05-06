import { Menubar } from "@components/tredici";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchEverywhereMenuItem = () => {
  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />}>Search Everywhere</Menubar.Item>
  );
};

export { SearchEverywhereMenuItem };
