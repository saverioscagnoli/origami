import { Menubar } from "~/components/tredici";
import { CloseAllWindowsMenuItem } from "./close-all-windows";
import { CloseWindowMenuItem } from "./close-window";
import { NewFileMenuItem } from "./new-file";
import { NewFolderMenuItem } from "./new-folder";
import { NewWindowMenuItem } from "./new-window";
import { SearchEverywhereMenuItem } from "./search-everywhere";
import { SearchHereMenuItem } from "./search-here";

const TopbarFileMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>File</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <NewWindowMenuItem />
        <Menubar.Separator />
        <NewFileMenuItem />
        <NewFolderMenuItem />
        <Menubar.Separator />
        <SearchHereMenuItem />
        <SearchEverywhereMenuItem />
        <Menubar.Separator />
        <CloseWindowMenuItem />
        <CloseAllWindowsMenuItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarFileMenu };
