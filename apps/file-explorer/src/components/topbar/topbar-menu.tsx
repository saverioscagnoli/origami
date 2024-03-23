import {
  CubeIcon,
  FilePlusIcon,
  MagnifyingGlassIcon
} from "@radix-ui/react-icons";
import { Menubar } from "@tredici/menubar";

const TopbarMenu = () => {
  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item leftIcon={<FilePlusIcon />}>New File...</Menubar.Item>
          <Menubar.Item leftIcon={<CubeIcon />}>New Folder...</Menubar.Item>

          <Menubar.Separator />

          <Menubar.Item leftIcon={<MagnifyingGlassIcon />}>Search</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
