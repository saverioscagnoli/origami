import { Menubar } from "@components/tredici";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const SearchEverywhereMenuItem = () => {
  return (
    <Menubar.Item leftIcon={<MagnifyingGlassIcon />} shortcut="Ctrl + Shift + F">
      Search Everywhere
    </Menubar.Item>
  );
};

export { SearchEverywhereMenuItem };
