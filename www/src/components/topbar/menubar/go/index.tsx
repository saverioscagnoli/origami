import { Menubar } from "~/components/tredici";
import { BackMenuItem } from "./back";
import { ConfigDirectoryMenuItem } from "./config-dir";
import { ForwardMenuItem } from "./forward";
import { KnownFoldersMenuItems } from "./known-folders";
import { ParentDirectoryMenuItem } from "./parent";

const TopbarGoMenu = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Go</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <ParentDirectoryMenuItem />
        <Menubar.Separator />
        <BackMenuItem />
        <ForwardMenuItem />
        <Menubar.Separator />
        <KnownFoldersMenuItems />
        <Menubar.Separator />
        <ConfigDirectoryMenuItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { TopbarGoMenu };
