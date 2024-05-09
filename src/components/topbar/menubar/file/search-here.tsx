import { Menubar } from "@components/tredici";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchHereMenuItem = () => {
  return <Menubar.Item leftIcon={<MagnifyingGlassIcon />}>Search Here</Menubar.Item>;
};

export { SearchHereMenuItem };
