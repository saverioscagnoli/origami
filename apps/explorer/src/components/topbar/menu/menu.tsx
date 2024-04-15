import { Menubar } from "@components/tredici";
import { NewFileMenuItem } from "./new-file";
import { NewFolderMenuItem } from "./new-folder";
import { BackMenuItem } from "./back";
import { ForwardMenuItem } from "./forward";
import { ThemeMenuItem } from "./theme";
import { ShowHiddenMenuItem } from "./show-hidden";
import { ShowCheckboxesItem } from "./show-checkboxes";
import { FindInFolderMenuItem } from "./find-in-folder";
import { SearchEverywhereMenuItem } from "./search-everywhere";
import { cn } from "@lib/utils";

const TopbarMenu = () => {
  return (
    <Menubar>
      <Menubar.Menu>
        <Menubar.Trigger>Menu</Menubar.Trigger>
        <Menubar.Content
          className={cn("select-none")}
          onCloseAutoFocus={e => e.preventDefault()}
        >
          <NewFileMenuItem />
          <NewFolderMenuItem />
          <Menubar.Separator />
          <BackMenuItem />
          <ForwardMenuItem />
          <Menubar.Separator />
          <ThemeMenuItem />
          <Menubar.Separator />
          <ShowHiddenMenuItem />
          <ShowCheckboxesItem />
          <Menubar.Separator />
          <FindInFolderMenuItem />
          <SearchEverywhereMenuItem />
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar>
  );
};

export { TopbarMenu };
