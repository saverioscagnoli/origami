import { Menubar } from "@components/tredici";
import { NewWindowMenuItem } from "./new-window";
import { NewFileMenuItem } from "./new-file";
import { NewFolderMenuItem } from "./new-folder";
import { CloseWindowMenuItem } from "./close-window";
import { CloseAllWindowsMenuItem } from "./close-all-windows";

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
        <CloseWindowMenuItem />
        <CloseAllWindowsMenuItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarFileMenu };
