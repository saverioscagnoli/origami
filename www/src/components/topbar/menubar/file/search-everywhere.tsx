import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Menubar } from "~/components/tredici";

const SearchEverywhereMenuItem = () => {
  return (
    <Menubar.Item
      leftIcon={<MagnifyingGlassIcon />}
      shortcut="Ctrl + Shift + F"
    >
      Search Everywhere
    </Menubar.Item>
  );
};

export { SearchEverywhereMenuItem };
