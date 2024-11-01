import React from "react";
import { Menubar } from "~/components/tredici";
import { BackItem } from "./back";
import { ConfigDirItem } from "./config-dir";
import { ForwardItem } from "./forward";
import { KnownFoldersItems } from "./known-folders";
import { ParentDirItem } from "./parent-dir";

const GoMenu: React.FC = () => {
  return (
    <Menubar.Menu>
      <Menubar.Trigger>Go</Menubar.Trigger>
      <Menubar.Content onCloseAutoFocus={e => e.preventDefault()}>
        <ParentDirItem />
        <Menubar.Separator />
        <BackItem />
        <ForwardItem />
        <Menubar.Separator />
        <KnownFoldersItems />
        <Menubar.Separator />
        <ConfigDirItem />
      </Menubar.Content>
    </Menubar.Menu>
  );
};

export { GoMenu };
